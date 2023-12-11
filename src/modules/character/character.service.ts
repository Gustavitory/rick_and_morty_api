import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Character,
  CharacterDocument,
} from '../database/schemas/character.schema';
import { Model } from 'mongoose';
import { CreateCharacterDTO, UpdateCharacterDTO } from './character.dto';
import { CategoryService } from '../category/category.service';
import { TypeService } from '../type/type.service';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    private readonly categoryService: CategoryService,
    private readonly typeService: TypeService,
  ) {}

  async getAllCharacters(
    type?: 'ACTIVE' | 'SUSPENDED' | 'CANCELED',
    species?: string,
    page: number = 1,
  ) {
    if (page < 1) {
      throw new Error('El número de página debe ser mayor o igual a 1.');
    }
    const itemsPerPage = 5;
    const filter = {};
    if (species) {
      const category = await this.categoryService.findCat(
        species.toUpperCase(),
        'SPECIES',
      );
      if (category) {
        filter['category'] = category._id;
      }
    }
    if (type) {
      const statusAsoc = await this.typeService.findStatus('CHARACTERS', type);
      if (statusAsoc) {
        filter['status'] = statusAsoc._id;
      }
    }
    try {
      const totalItems = await this.characterModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const characters = await this.characterModel
        .find(filter)
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .populate({
          path: 'status',
          populate: { path: 'type' },
        })
        .populate({
          path: 'category',
          populate: { path: 'subcategories' },
        })
        .exec();
      return {
        info: {
          page,
          count: totalItems,
          totalPages,
        },
        results: characters,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(`Query error: ${err}`);
    }
  }
  async createCharacter(info: CreateCharacterDTO) {
    const { url, name, specie, status: type, state, gender } = info;
    const existingCharacter = await this.characterModel.findOne({
      name,
      'status.status': type.toUpperCase(),
      'category.subcategories.subcategory': specie.toUpperCase(),
    });

    if (existingCharacter) {
      throw new BadRequestException(
        'Ya existe un personaje con el mismo nombre, especie y tipo.',
      );
    }
    const status = await this.typeService.findOrCreateStatus(
      'CHARACTERS',
      type,
    );
    const category = await this.categoryService.findOrCreateCat(
      specie.toUpperCase(),
      'SPECIES',
    );
    const newCharacter = new this.characterModel({
      name,
      status,
      category,
      url,
      state,
      gender,
    });
    await newCharacter.save();
    return newCharacter;
  }
  async updateCharacter(characterId: string, updatedData: UpdateCharacterDTO) {
    // Obtener las propiedades específicas a actualizar
    const { name, specie, status, url, state, gender, image } = updatedData;
    const filter: Record<string, any> = {
      _id: { $ne: characterId }, // Excluir el personaje actual de la búsqueda
    };
    if (name || specie || status) {
      // Validar que no haya otro personaje con la misma especie, estado y nombre
      const oldCharacter = await this.characterModel
        .findOne({
          _id: characterId,
        })
        .exec();
      if (specie) {
        const category = await this.categoryService.findOrCreateCat(
          specie.toUpperCase(),
          'SPECIES',
        );
        if (category) {
          filter['category'] = category._id;
        }
      } else filter['category'] = oldCharacter.category._id;
      if (status) {
        const statusAsoc = await this.typeService.findOrCreateStatus(
          'CHARACTERS',
          status,
        );
        if (statusAsoc) {
          filter['status'] = statusAsoc._id;
        }
      } else filter['status'] = oldCharacter.status._id;

      filter.name = name ?? oldCharacter.name;
      const existingCharacter = await this.characterModel.findOne(filter);

      if (existingCharacter) {
        throw new Error(
          'Ya existe un personaje con la misma especie, estado y nombre.',
        );
      }
    }

    // Construir el objeto de actualización con solo los campos proporcionados
    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (specie) updateFields.category = filter['category'];
    if (status) updateFields.status = filter['status'];
    if (url) updateFields.url = url;
    if (state) updateFields.state = state;
    if (gender) updateFields.gender = gender;
    if (image) updateFields.image = image;
    // Actualizar el personaje utilizando findOneAndUpdate
    const updatedCharacter = await this.characterModel
      .findOneAndUpdate(
        { _id: characterId },
        { $set: updateFields },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedCharacter) {
      throw new NotFoundException('Personaje no encontrado');
    }

    return updatedCharacter;
  }

  async findACharacter(characterID: string) {
    return await this.characterModel.findOne({ _id: characterID });
  }
}
