import express, { Application } from "express";
import dotenv from "dotenv";
import { logError, logInfo } from "./utils/logger";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import prisma from "./config/prisma";
import passport from "passport"; // Import Passport
import session from "express-session"; // For session handling
import "./config/passport"; // Import Passport configuration

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
    this.initializePassport(); // Initialize Passport
  }

  private configureMiddleware(): void {
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: "*" }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: false,
      })
    );
  }

  private initializePassport(): void {
    this.app.use(passport.initialize());
    this.app.use(passport.session()); // If you're using sessions
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
        } else if (
          stats.isFile() &&
          (file.endsWith(".js") || file.endsWith(".ts"))
        ) {
          try {
            const routeModule = await import(fullPath.replace(".js", ".ts"));

            if (routeModule.default) {
              const route = fullPath
                .replace(routePath, "")
                .replace(/\\/g, "/")
                .replace(/\.ts$/, "")
                .replace(/\.js$/, "");

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
