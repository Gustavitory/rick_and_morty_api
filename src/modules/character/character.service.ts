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
import {
  StatusType,
  StatusTypeDocument,
} from '../database/schemas/statusType.schema';
import {
  StatusAsoc,
  StatusAsocDocument,
} from '../database/schemas/statusAsoc.schema';
import {
  Subcategory,
  SubcategoryDocument,
} from '../database/schemas/subcategory.schema';
import {
  Category,
  CategoryDocument,
} from '../database/schemas/category.schema';
import { UpdateCharacterDTO } from './character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    @InjectModel(StatusType.name)
    private statusTypeModel: Model<StatusTypeDocument>,
    @InjectModel(StatusAsoc.name)
    private statusAsocModel: Model<StatusAsocDocument>,
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<SubcategoryDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async getAllCharacters(type?: string, species?: string, page: number = 1) {
    if (page < 1) {
      throw new Error('El número de página debe ser mayor o igual a 1.');
    }
    const itemsPerPage = 5;
    const filter = {};
    if (species) {
      const subcategory = await this.subcategoryModel.findOne({
        subcategory: species.toUpperCase(),
      });

      const category = await this.categoryModel.findOne({
        category: 'SPECIES',
        subcategories: subcategory,
      });

      if (category) {
        filter['category'] = category._id;
      }
    }
    if (type) {
      const statusType = await this.statusTypeModel.findOne({
        type: 'CHARACTERS',
      });
      const statusAsoc = await this.statusAsocModel.findOne({
        status: type.toUpperCase(),
        type: statusType,
      });
      if (statusAsoc) {
        filter['status'] = statusAsoc._id;
      }
    }
    try {
      const totalItems = await this.characterModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      console.log(filter);
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
  async createCharacter(info: {
    name: string;
    specie: string;
    status: string;
    url?: string;
  }) {
    const { url, name, specie, status: type } = info;
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
    const statusType = await this.statusTypeModel.findOneAndUpdate(
      { type: 'CHARACTERS' },
      {},
      { new: true, upsert: true },
    );
    const status = await this.statusAsocModel.findOneAndUpdate(
      { type: statusType, status: type.toUpperCase() },
      {},
      { new: true, upsert: true },
    );
    const subCat = await this.subcategoryModel.findOneAndUpdate(
      { subcategory: specie.toUpperCase() },
      {},
      { new: true, upsert: true },
    );
    const category = await this.categoryModel.findOneAndUpdate(
      { category: 'SPECIES', subcategories: subCat },
      {},
      { new: true, upsert: true },
    );
    const newCharacter = new this.characterModel({
      name,
      status,
      category,
      url,
    });
    await newCharacter.save();
    return newCharacter;
  }
  async updateCharacter(characterId: string, updatedData: UpdateCharacterDTO) {
    // Obtener las propiedades específicas a actualizar
    const { name, specie, status } = updatedData;

    // Validar que no haya otro personaje con la misma especie, estado y nombre
    const filter: Record<string, any> = {
      _id: { $ne: characterId }, // Excluir el personaje actual de la búsqueda
    };
    if (specie) {
      const subcategory = await this.subcategoryModel.findOneAndUpdate(
        {
          subcategory: specie.toUpperCase(),
        },
        {},
        { new: true, upsert: true },
      );

      const category = await this.categoryModel.findOneAndUpdate(
        {
          category: 'SPECIES',
          subcategories: subcategory,
        },
        {},
        { new: true, upsert: true },
      );

      if (category) {
        filter['category'] = category._id;
      }
    }
    if (status) {
      const statusType = await this.statusTypeModel.findOne({
        type: 'CHARACTERS',
      });
      const statusAsoc = await this.statusAsocModel.findOneAndUpdate(
        {
          status: status.toUpperCase(),
          type: statusType,
        },
        {},
        { new: true, upsert: true },
      );
      if (statusAsoc) {
        filter['status'] = statusAsoc._id;
      }
    }

    if (name) {
      filter.name = name;
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
}
