import { Example } from "../types";

export class ExampleService {
  public doStuff(): Example {
    return {
      fieldOne: "foo",
      fieldTwo: "bar"
    };
  }
}
