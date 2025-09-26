// Simple in-memory storage for new content
export class MemoryStorage {
  private static instance: MemoryStorage;
  private content: any[] = [];

  static getInstance(): MemoryStorage {
    if (!MemoryStorage.instance) {
      MemoryStorage.instance = new MemoryStorage();
    }
    return MemoryStorage.instance;
  }

  addContent(content: any) {
    const newContent = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.content.unshift(newContent); // Add to beginning
    console.log('Added to memory storage:', newContent);
    return newContent;
  }

  getContent(type?: string, categoryId?: string) {
    let filtered = this.content;
    
    if (type) {
      filtered = filtered.filter(item => item.contentType === type);
    }
    
    if (categoryId) {
      filtered = filtered.filter(item => item.categoryId === categoryId);
    }
    
    return filtered;
  }

  getAllContent() {
    return this.content;
  }
}