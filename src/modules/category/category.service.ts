import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category,
  CategoryDocument,
} from '../database/schemas/category.schema';
import { Model } from 'mongoose';
import {
  Subcategory,
  SubcategoryDocument,
} from '../database/schemas/subcategory.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<SubcategoryDocument>,
  ) {}

  async findCat(subCat: string, category: 'SPECIES' | 'SEASON') {
    try {
      const subcategory = await this.subcategoryModel.findOne({
        subcategory: subCat,
      });
      return await this.categoryModel.findOne({
        category: category,
        subcategories: subcategory,
      });
    } catch {}
  }
  async findOrCreateCat(subCat: string, category: 'SPECIES' | 'SEASON') {
    const subCate = await this.subcategoryModel.findOneAndUpdate(
      { subcategory: subCat },
      {},
      { new: true, upsert: true },
    );
    return await this.categoryModel.findOneAndUpdate(
      { category: category, subcategories: subCate },
      {},
      { new: true, upsert: true },
    );
  }
}
