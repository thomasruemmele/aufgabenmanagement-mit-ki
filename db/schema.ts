import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const lists = sqliteTable('lists', {
  id: text('id').primaryKey(), name: text('name').notNull(),
  kind: text('kind').notNull().default('project'),
  revision: integer('revision').notNull().default(1),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
});
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(), listId: text('list_id').notNull().references(()=>lists.id, {onDelete:'restrict'}),
  title: text('title').notNull(), notes: text('notes').notNull().default(''),
  dueDate: text('due_date'), reminderAt: text('reminder_at'),
  done: integer('done', {mode:'boolean'}).notNull().default(false),
  revision: integer('revision').notNull().default(1),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
}, t=>[index('tasks_list_idx').on(t.listId), index('tasks_due_idx').on(t.dueDate)]);
