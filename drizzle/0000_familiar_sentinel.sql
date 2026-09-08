CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`variant_label` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price_cents` integer NOT NULL,
	`line_total_cents` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text DEFAULT 'Cliente via WhatsApp' NOT NULL,
	`customer_phone` text DEFAULT '' NOT NULL,
	`total_cents` integer NOT NULL,
	`status` text DEFAULT 'Novo' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category_id` text,
	`image_url` text DEFAULT '/vitale-hero.png' NOT NULL,
	`short_description` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`ingredients` text DEFAULT '' NOT NULL,
	`nutrition` text DEFAULT '' NOT NULL,
	`brand` text DEFAULT 'Vitale' NOT NULL,
	`sku` text DEFAULT '' NOT NULL,
	`sale_type` text DEFAULT 'unit' NOT NULL,
	`unit_label` text DEFAULT 'unidade' NOT NULL,
	`price_cents` integer NOT NULL,
	`sale_price_cents` integer,
	`min_qty` integer DEFAULT 1 NOT NULL,
	`max_qty` integer DEFAULT 99 NOT NULL,
	`stock_qty` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`promotion` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`variants_json` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `store_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`whatsapp` text DEFAULT '' NOT NULL,
	`instagram` text DEFAULT '@vitaleprodutosnaturaisibaiti' NOT NULL,
	`address` text DEFAULT 'Ibaiti - Paraná' NOT NULL,
	`hours` text DEFAULT 'Consulte pelo WhatsApp' NOT NULL,
	`checkout_message` text DEFAULT 'Olá! Gostaria de fazer este pedido na Vitale Produtos Naturais:' NOT NULL,
	`updated_at` integer NOT NULL
);
