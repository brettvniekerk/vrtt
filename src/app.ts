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

app.use(morgan("dev"));

// disable leaking express
app.disable("x-powered-by");

// helmet security rules
app.use(helmet());

// custom middleware
// ...

// swagger
app.use(["/swagger", "/docs"], swagger.serve, swagger.setup(swaggerJson));

// need to register routes first before handling unknown routes and errors
RegisterRoutes(app);

// basic error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // from docs, may as well keep
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);

    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields
    });
  }

  // generic handler
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
      details: err.message
    });
  }

  next();
});

// not found handler
app.use((_: Request, res: Response) =>
  res.status(404).send({
    message: "Not Found"
  })
);
