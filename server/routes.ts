import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlatformSchema, insertModuleSchema, insertQuoteSchema, insertSiteContentSchema, insertGalleryImageSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // PLATFORMS
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getPlatforms();
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ error: "Failed to fetch platforms" });
    }
  });

  app.get("/api/platforms/:id", async (req, res) => {
    try {
      const platform = await storage.getPlatform(req.params.id);
      if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      res.json(platform);
    } catch (error) {
      console.error("Error fetching platform:", error);
      res.status(500).json({ error: "Failed to fetch platform" });
    }
  });

  app.post("/api/platforms", async (req, res) => {
    try {
      const validatedData = insertPlatformSchema.parse(req.body);
      const platform = await storage.createPlatform(validatedData);
      res.status(201).json(platform);
    } catch (error) {
      console.error("Error creating platform:", error);
      res.status(400).json({ error: "Invalid platform data" });
    }
  });

  app.patch("/api/platforms/:id", async (req, res) => {
    try {
      const platform = await storage.updatePlatform(req.params.id, req.body);
      res.json(platform);
    } catch (error) {
      console.error("Error updating platform:", error);
      res.status(400).json({ error: "Failed to update platform" });
    }
  });

  app.delete("/api/platforms/:id", async (req, res) => {
    try {
      await storage.deletePlatform(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting platform:", error);
      res.status(500).json({ error: "Failed to delete platform" });
    }
  });

  // MODULES
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.getModule(req.params.id);
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.json(module);
    } catch (error) {
      console.error("Error fetching module:", error);
      res.status(500).json({ error: "Failed to fetch module" });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const validatedData = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(validatedData);
      res.status(201).json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(400).json({ error: "Invalid module data" });
    }
  });

  app.patch("/api/modules/:id", async (req, res) => {
    try {
      const module = await storage.updateModule(req.params.id, req.body);
      res.json(module);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(400).json({ error: "Failed to update module" });
    }
  });

  app.delete("/api/modules/:id", async (req, res) => {
    try {
      await storage.deleteModule(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  // QUOTES
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ error: "Failed to fetch quote" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      console.error("Error creating quote:", error);
      res.status(400).json({ error: "Invalid quote data" });
    }
  });

  // SITE CONTENT
  app.get("/api/site-content", async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContentByKey(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching site content:", error);
      res.status(500).json({ error: "Failed to fetch site content" });
    }
  });

  app.post("/api/site-content", async (req, res) => {
    try {
      const validatedData = insertSiteContentSchema.parse(req.body);
      const content = await storage.upsertSiteContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating/updating site content:", error);
      res.status(400).json({ error: "Invalid site content data" });
    }
  });

  // GALLERY IMAGES
  app.get("/api/gallery-images", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery-images/:id", async (req, res) => {
    try {
      const image = await storage.getGalleryImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Gallery image not found" });
      }
      res.json(image);
    } catch (error) {
      console.error("Error fetching gallery image:", error);
      res.status(500).json({ error: "Failed to fetch gallery image" });
    }
  });

  app.post("/api/gallery-images", async (req, res) => {
    try {
      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ error: "Invalid gallery image data" });
    }
  });

  app.patch("/api/gallery-images/:id", async (req, res) => {
    try {
      const image = await storage.updateGalleryImage(req.params.id, req.body);
      res.json(image);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(400).json({ error: "Failed to update gallery image" });
    }
  });

  app.delete("/api/gallery-images/:id", async (req, res) => {
    try {
      await storage.deleteGalleryImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ error: "Failed to delete gallery image" });
    }
  });

  // OBJECT STORAGE - Image uploads
  // Referenced from blueprint: javascript_object_storage (public file uploading)
  
  // Endpoint for serving uploaded objects (images)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Endpoint for getting upload URL
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  // Endpoint for getting public upload URL (for hero images, etc.)
  app.post("/api/objects/upload-public", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getPublicObjectUploadURL();
    res.json({ uploadURL });
  });

  // Endpoint for updating platform image after upload
  app.put("/api/platforms/:id/image", async (req, res) => {
    if (!req.body.imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageUrl,
      );

      // Update platform with the image path
      const platform = await storage.updatePlatform(req.params.id, {
        imageUrl: objectPath,
      });

      res.status(200).json({
        objectPath: objectPath,
        platform,
      });
    } catch (error) {
      console.error("Error setting platform image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Endpoint for updating module image after upload
  app.put("/api/modules/:id/image", async (req, res) => {
    if (!req.body.imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(
        req.body.imageUrl,
      );

      // Update module with the image path
      const module = await storage.updateModule(req.params.id, {
        imageUrl: objectPath,
      });

      res.status(200).json({
        objectPath: objectPath,
        module,
      });
    } catch (error) {
      console.error("Error setting module image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
