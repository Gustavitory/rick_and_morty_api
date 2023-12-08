import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { url } from './constants';
import { Character, Episode, Location } from './interfaces';

@Injectable()
export class RickAndMortyApiService {
  async getCharacters(page = 1): Promise<Character[]> {
    const response = await axios.get(`${url}/character/?page=${page}`);
    return response.data.results;
  }
  async getLocations(page = 1): Promise<Location[]> {
    const response = await axios.get(`${url}/location/?page=${page}`);
    return response.data.results;
  }
  async getEpisodes(page = 1): Promise<Episode> {
    const response = await axios.get(`${url}/episode/?page=${page}`);
    return response.data.results;
  }
}
