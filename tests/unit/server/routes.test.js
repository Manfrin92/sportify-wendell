import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import config from "../../../server/config.js";
import { Controller } from "../../../server/controller.js";
import { handler } from "../../../server/routes.js";
import TestUtil from "../_util/testUtil.js";

const {
  pages: { controllerHTML, homeHTML },
  location,
} = config;

describe("#Routes - test site for api response", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("GET / should redirect to home page", async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = "GET";
    params.request.url = "/";

    await handler(...params.values());

    expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      Location: location.home,
    });
  });

  test(`GET /contoller should respond with ${controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = "GET";
    params.request.url = "/controller";

    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      controllerHTML
    );
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  test.todo(
    "GET /unknown given an inexistent route it should respond with 404"
  );

  test("GET /file.ext should respond with file stream", async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = "GET";
    params.request.url = "/controller";

    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });
  });

  describe("exceptions", () => {
    test.todo("Given inexistent file it should respond with 404");
    test.todo("Given an error it should respond with 500");
  });
});
