CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_products_active_featured` ON `products` (`active`,`featured`);--> statement-breakpoint
CREATE INDEX `idx_products_category` ON `products` (`category_id`);