import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favourite } from './entities/favourite.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private favouritesRepository: Repository<Favourite>,
  ) {}

  async create(createFavouriteDto: CreateFavouriteDto): Promise<Favourite> {
    const favourite = this.favouritesRepository.create(createFavouriteDto);
    return this.favouritesRepository.save(favourite);
  }

  async findAll(): Promise<Favourite[]> {
    return this.favouritesRepository.find();
  }

  async findOne(id: number): Promise<Favourite> {
    return this.favouritesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateFavouriteDto: UpdateFavouriteDto): Promise<Favourite> {
    await this.favouritesRepository.update(id, updateFavouriteDto);
    return this.favouritesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.favouritesRepository.delete(id);
  }
}
