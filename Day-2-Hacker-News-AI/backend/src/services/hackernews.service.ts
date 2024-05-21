import fetch from 'node-fetch';

// hackernews.service.ts
interface HackerNewsItem {
    id: number;
    title: string;
    by: string;
    time: number;
    type: string;
    url?: string;
    text?: string;
    descendants?: number;
    kids?: number[];
    score?: number;
  }
    
  const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

  export async function getTopStoryIds(limit = 30): Promise<number[]> {
    const response = await fetch(`${BASE_URL}/topstories.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch top story IDs: ${response.status}`);
    }
  
    const topStoryIds = await response.json();
  
    // Type Guard 
    if (!Array.isArray(topStoryIds) || !topStoryIds.every(id => typeof id === 'number')) {
        throw new Error('Invalid response from Hacker News API: expected an array of numbers');
    }
    
    return topStoryIds.slice(0, limit);
  }
  
  export async function getHackerNewsItem(itemId: number): Promise<HackerNewsItem> {
    try {
      const url = `${BASE_URL}/item/${itemId}.json`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch item ${itemId}: ${response.status}`);
      }
  
      const data: unknown = await response.json();
  
      // Validate the data against the HackerNewsItem interface
      const itemData: HackerNewsItem = validateHackerNewsItem(data);
  
      return itemData;
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      throw error; 
    }
  }
  
  function validateHackerNewsItem(data: unknown): HackerNewsItem {
    if (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof data.id === 'number' &&
      'title' in data &&
      typeof data.title === 'string' &&
      'by' in data &&
      typeof data.by === 'string' &&
      'time' in data &&
      typeof data.time === 'number' &&
      'type' in data &&
      typeof data.type === 'string'
      // Add checks for other properties in the HackerNewsItem interface here
    ) {
      return data as HackerNewsItem; 
    } else {
      throw new Error('Invalid HackerNewsItem format');
    }
  }
  
