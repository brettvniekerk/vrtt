import express, {
  json,
  urlencoded,
  Request,
  Response,
  NextFunction
} from "express";
import swagger from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import swaggerJson from "../build/swagger.json";
import { ValidateError } from "tsoa";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

export const app = express();

// express middleware
app.use(
  urlencoded({
    extended: true
  })
);
app.use(json());
app.use(cors());

// get rid of 304 status
app.disable("etag"); // can also use custom middleware to set the last modified time to now
app.use(morgan("tiny"));

// helmet security rules
app.use(helmet());

// custom middleware

// swagger
app.use(["/swagger", "/docs"], swagger.serve, swagger.setup(swaggerJson));

// basic error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);

    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }

  next();
});

// need to register routes first before handling unknown routes
RegisterRoutes(app);

// not found handler
app.use((_: Request, res: Response) =>
  res.status(404).send({
    message: "Not Found"
  })
);
