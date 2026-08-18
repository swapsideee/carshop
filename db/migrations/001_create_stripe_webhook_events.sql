CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  stripe_event_id VARCHAR(255) NOT NULL,
  status ENUM('processing', 'completed') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  PRIMARY KEY (stripe_event_id),
  KEY stripe_webhook_events_status_updated_at (status, updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
