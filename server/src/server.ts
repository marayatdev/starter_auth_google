import express, { Application } from "express";
import dotenv from "dotenv";
import { logError, logInfo } from "./utils/logger";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import prisma from "./config/prisma";

dotenv.config();

class App {
  private app: Application;
  private port: number = Number(process.env.PORT) || 8000;

  constructor() {
    this.app = express();
    this.setup();
    this.initializeRoutes();
    this.startServer();
    this.initializeDatabase();
  }

  private setup(): void {
    this.configureMiddleware();
  }

  private configureMiddleware(): void {
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(bodyParser.json());
  }

  private async initializeRoutes(): Promise<void> {
    const routePath = path.resolve(__dirname, "routes");

    const loadRoutes = async (directory: string): Promise<void> => {
      const files = fs.readdirSync(directory);

      for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          await loadRoutes(fullPath);
        } else if (stats.isFile()) {
          // Check for .js files instead of .ts files in the build version
          if (file.endsWith(".js")) {
            try {
              const routeModule = await import(fullPath);
              if (routeModule.default) {
                const route = fullPath
                  .replace(routePath, "")
                  .replace(/\\/g, "/")
                  .replace(/\.js$/, ""); // Make sure to strip .js in the final path
                this.app.use(`/api${route}`, routeModule.default);
                this.app.use(
                  "/api/media",
                  express.static(path.join(__dirname, "./uploads/"))
                );
              }
            } catch (error) {
              logError(`Error loading route module ${file}: ${error}`);
            }
          }
        }
      }
    };

    await loadRoutes(routePath);
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      logInfo(`🚀 Server is running on http://localhost:${this.port}`);
    });
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await prisma.$connect();
      logInfo("🤩 Connected to the database");
    } catch (error) {
      logError(`Database connection error: ${error}`);
      throw new Error(`Database connection error: ${error}`);
    }
  }
}

new App();
