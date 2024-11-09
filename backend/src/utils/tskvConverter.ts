export class TSKVconverter {
  private queue: Map<any, string>;
  private processed: Set<object | Array<any>>;
  private line: Array<string>;
  constructor(val: any, name?: string) {
    this.queue = new Map();
    this.processed = new Set();
    this.line = new Array();
    this.process(name, val);
  }

  private handleVal(name: string, val: any) {
    switch (true) {
      case val instanceof Date:
        this.addDate(name, val);
        return;
      case Array.isArray(val):
      case typeof val === 'object':
        this.queue.set(val, name);
        return;
      default:
        this.addPrimitive(name, val);
        break;
    }
  }

  private addPrimitive(name: string, val: string | null | undefined | number) {
    this.line.push(`${String(name)}=${String(val)}`);
  }

  private addDate(name: string, date: Date) {
    const prefix = name ? `${name}.` : '';
    this.line.push(`${prefix + 'day'}=${String(date.getDate())}`);
    this.line.push(`${prefix + 'month '}=${String(date.getMonth())}`);
    this.line.push(`${prefix + 'year'}=${String(date.getFullYear())}`);
    this.line.push(
      `${prefix + 'time'}=${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`,
    );
  }

  private unpackObject(name: string, obj: object) {
    if (this.processed.has(obj)) {
      return;
    }
    Object.keys(obj).forEach((key) => {
      this.handleVal(name ? `${name}.${key}` : key, obj[key]);
    });
    this.processed.add(obj);
  }
  private unpackArray(name: string, arr: Array<any>) {
    if (this.processed.has(arr)) {
      return;
    }
    arr.forEach((val, index) => {
      this.handleVal(`${name}[${index}]`, val);
    });
    this.processed.add(arr);
  }

  public timestamp() {
    const date=new Date();
    this.line.unshift(
      `${'time'}=${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`,
    );
    this.line.unshift(`${'year'}=${String(date.getFullYear())}`);
    this.line.unshift(`${'month '}=${String(date.getMonth())}`);
    this.line.unshift(`${'day'}=${String(date.getDate())}`);
    return this
  }

  public add(val: any, name?: string) {
    this.queue = new Map();
    this.processed = new Set();
    this.process(name, val);
    return this;
  }

  public stringify() {
    return this.line.join('\t');
  }

  private process(name: string, val: any) {
    this.handleVal(name, val);
    while (this.queue.size > 0) {
      const [subVal, subName] = this.queue.entries().next().value;
      if (Array.isArray(subVal)) {
        this.unpackArray(subName, subVal);
      } else {
        this.unpackObject(subName, subVal);
      }
      this.queue.delete(subVal);
    }
  }
}
