interface ContentfulMetadata {
  tags: any[];
  concepts: any[];
}

interface SysLink {
  type: string;
  linkType: string;
  id: string;
}

interface SysEnvironment {
  sys: SysLink;
}

interface SysContentType {
  sys: SysLink;
}

interface ContentfulSys {
  space: {
    sys: SysLink;
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: SysEnvironment;
  publishedVersion: number;
  revision: number;
  contentType: SysContentType;
  locale: string;
}

interface ContentfulFields {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export interface ContentfulProduct {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: ContentfulFields;
}
