export interface Recap {
  tripId: string;
  generatedAt: string;
  summary: string;
  highlights: string[];
  story: {
    short: string;
    medium: string;
    long: string;
  };
  stats: {
    days: number;
    areasVisited: string[];
    topCategories: string[];
    memoriesCount: number;
  };
}