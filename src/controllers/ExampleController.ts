import { Controller, Get, Route, SuccessResponse, Tags } from "tsoa";
import { Example } from "../types";
import { ExampleService } from "../services/ExampleService";

@Tags("example")
@Route("example")
export class ExampleController extends Controller {
  private service: ExampleService;

  constructor() {
    super();
    this.service = new ExampleService();
  }

  /**
   * A basic example endpoint
   * @returns A basic example object
   */
  @SuccessResponse(200)
  @Get()
  public async getExample(): Promise<Example> {
    this.setStatus(200);
    return this.service.doStuff();
  }
}
