export type ColumnContract = {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
  autoIncrement?: boolean;
  characterSet?: 'utf8mb4';
};

export type IndexContract = {
  columns: string[];
  unique: boolean;
};

export type ForeignKeyContract = {
  columns: string[];
  referencedTable: string;
  referencedColumns: string[];
  onDelete: 'CASCADE' | 'RESTRICT';
};

export type TableContract = {
  name: string;
  columns: ColumnContract[];
  indexes: IndexContract[];
  foreignKeys?: ForeignKeyContract[];
};

const autoIncrementId: ColumnContract = {
  name: 'id',
  type: 'int',
  nullable: false,
  defaultValue: null,
  autoIncrement: true,
};

const nullableVarchar = (name: string, length: number): ColumnContract => ({
  name,
  type: `varchar(${length})`,
  nullable: true,
  defaultValue: null,
  characterSet: 'utf8mb4',
});

const nullableInteger = (name: string): ColumnContract => ({
  name,
  type: 'int',
  nullable: true,
  defaultValue: null,
});

export const catalogSchemaContract: TableContract[] = [
  {
    name: 'brands',
    columns: [
      autoIncrementId,
      nullableVarchar('name', 25),
      nullableVarchar('slug', 25),
      nullableVarchar('image', 255),
    ],
    indexes: [
      { columns: ['id'], unique: true },
      { columns: ['slug'], unique: true },
    ],
  },
  {
    name: 'products',
    columns: [
      autoIncrementId,
      nullableVarchar('model', 255),
      nullableVarchar('name', 255),
      nullableVarchar('image', 255),
      nullableInteger('price_pair'),
      nullableInteger('price_set'),
      nullableVarchar('slug', 255),
      nullableVarchar('brand_slug', 255),
      nullableInteger('brand_id'),
    ],
    indexes: [
      { columns: ['id'], unique: true },
      { columns: ['brand_slug', 'price_pair'], unique: false },
      { columns: ['brand_slug', 'model'], unique: false },
      { columns: ['price_pair'], unique: false },
      { columns: ['model'], unique: false },
      { columns: ['brand_id'], unique: false },
    ],
    foreignKeys: [
      {
        columns: ['brand_id'],
        referencedTable: 'brands',
        referencedColumns: ['id'],
        onDelete: 'RESTRICT',
      },
    ],
  },
  {
    name: 'product_images',
    columns: [
      autoIncrementId,
      {
        name: 'product_id',
        type: 'int',
        nullable: false,
        defaultValue: null,
      },
      {
        name: 'image_url',
        type: 'varchar(255)',
        nullable: false,
        defaultValue: null,
        characterSet: 'utf8mb4',
      },
    ],
    indexes: [
      { columns: ['id'], unique: true },
      { columns: ['product_id'], unique: false },
    ],
    foreignKeys: [
      {
        columns: ['product_id'],
        referencedTable: 'products',
        referencedColumns: ['id'],
        onDelete: 'CASCADE',
      },
    ],
  },
  {
    name: 'reviews',
    columns: [
      autoIncrementId,
      {
        name: 'product_id',
        type: 'int',
        nullable: false,
        defaultValue: null,
      },
      {
        name: 'rating',
        type: 'int',
        nullable: false,
        defaultValue: null,
      },
      nullableVarchar('author_name', 60),
      {
        name: 'comment',
        type: 'text',
        nullable: false,
        defaultValue: null,
        characterSet: 'utf8mb4',
      },
      {
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
        defaultValue: 'CURRENT_TIMESTAMP',
      },
    ],
    indexes: [
      { columns: ['id'], unique: true },
      { columns: ['product_id', 'created_at', 'id'], unique: false },
      { columns: ['created_at', 'id'], unique: false },
    ],
    foreignKeys: [
      {
        columns: ['product_id'],
        referencedTable: 'products',
        referencedColumns: ['id'],
        onDelete: 'CASCADE',
      },
    ],
  },
];
