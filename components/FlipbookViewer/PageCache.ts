class PageCache {
  private cache: Map<number, string> = new Map(); // pageIndex -> dataUrl

  public get(pageIndex: number): string | undefined {
    return this.cache.get(pageIndex);
  }

  public set(pageIndex: number, dataUrl: string): void {
    this.cache.set(pageIndex, dataUrl);
  }

  public has(pageIndex: number): boolean {
    return this.cache.has(pageIndex);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const pageCache = new PageCache();
export default PageCache;
