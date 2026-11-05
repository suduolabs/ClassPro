.PHONY: help build up down logs clean dev frontend backend


help: 
	@echo "ClassPro Docker Management"
	@echo "========================"
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


build: ## Build both images
	docker compose build

up: ## Start both services detached
	docker compose up -d

down: ## Stop both services
	docker compose down

logs: ## Follow logs for both services
	docker compose logs -f

status: ## Show container status
	docker compose ps


frontend-build: ## Build the frontend image only
	docker build -t classpro-frontend ./frontend

frontend-up: ## Start the frontend alone
	cd frontend && docker compose up -d

frontend-down: ## Stop the standalone frontend
	cd frontend && docker compose down

frontend-logs: ## Follow frontend logs
	cd frontend && docker compose logs -f

backend-build: ## Build the backend image only
	docker build -f backend/dockerfile -t classpro-backend ./backend

backend-up: ## Start the backend alone
	cd backend && docker compose up -d

backend-down: ## Stop the standalone backend
	cd backend && docker compose down

backend-logs: ## Follow backend logs
	cd backend && docker compose logs -f


dev: ## Run the frontend dev server in a container
	docker compose run --service-ports frontend bun run dev

dev-backend: ## Run the backend dev server in a container
	docker compose run --service-ports backend go run src/main.go


clean: ## Remove containers, images, volumes and prune
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -f

restart: ## Restart both services
	docker compose restart

restart-frontend: ## Restart the frontend
	docker compose restart frontend

restart-backend: ## Restart the backend
	docker compose restart backend


health: ## Print container status and ports
	@echo "Checking service health..."
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"


shell-frontend: ## Open a shell in the frontend container
	docker compose exec frontend sh

shell-backend: ## Open a shell in the backend container
	docker compose exec backend sh

start: build up ## Build then start everything
	@echo "ClassPro is starting..."
	@echo "Frontend: http://localhost:243"
	@echo "Backend:  http://localhost:8080"
	@echo ""
	@echo "Use 'make logs' to view logs"
	@echo "Use 'make down' to stop services" 