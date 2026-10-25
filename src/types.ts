export type TransitionType = 'fade' | 'slide' | 'zoom';

export interface RouteDefinition {
  path: string;
  name: string;
  title: string;
  icon: string;
  badge?: string;
  description: string;
}

export interface NavigationEvent {
  id: string;
  timestamp: string;
  type: 'pushState' | 'replaceState' | 'popstate' | 'async_fetch' | 'dom_render' | 'error_404';
  url: string;
  details: string;
  latencyMs?: number;
  statusCode?: number;
}

export interface HistoryEntry {
  url: string;
  title: string;
  timestamp: number;
  state: Record<string, unknown>;
}

export interface DeliverableFile {
  id: string;
  name: string;
  path: string;
  type: 'html' | 'css' | 'js' | 'json' | 'md';
  language: string;
  category: 'Markup' | 'Styles' | 'JavaScript Logic' | 'Documentation' | 'Mock Data';
  sizeBytes: number;
  description: string;
  content: string;
}

export interface ValidationTestItem {
  id: string;
  title: string;
  category: 'Routing' | 'DOM Lifecycle' | 'History API' | 'State & Persistence' | 'Error Resilience';
  description: string;
  status: 'passed' | 'failed' | 'running' | 'idle';
  detail: string;
}

export interface ProductCatalogItem {
  id: string;
  name: string;
  category: 'Router' | 'State' | 'Animation' | 'Tooling';
  version: string;
  description: string;
  stars: number;
  tags: string[];
  specs: {
    bundleSize: string;
    dependencies: number;
    lifecycleHooks: string[];
  };
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}
