import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { url } from './constants';
import { Character, Episode, perPageApiResponse } from './interfaces';

@Injectable()
export class RickAndMortyApiService {
  async getCharacters(): Promise<Character[]> {
    let next = `${url}/character/?page=1`;
    let characters = [];
    try {
      while (next) {
        const response = await axios.get<perPageApiResponse>(next);
        characters = [...characters, ...response.data.results];
        next = response.data.info.next;
      }
    } catch (err) {
      throw new BadRequestException('Obtaining characters Error: ', err);
    }
    return characters;
  }
  async getEpisodes(): Promise<Episode[]> {
    let next = `${url}/episode/?page=1`;
    let episodes = [];
    try {
      while (next) {
        const response = await axios.get<perPageApiResponse>(next);
        episodes = [...episodes, ...response.data.results];
        next = response.data.info.next;
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Obtaining episodes error');
    }

    return episodes;
  }
}
