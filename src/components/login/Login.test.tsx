import { render, waitFor, screen} from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

jest.mock("axios");

describe("Login", () => {
  test("calls API and sets token", async () => {
    const setToken = jest.fn();
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: { token: "test_token" } });
    render(<Login setToken={setToken} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(() => screen.getByRole("status")).toThrow();
    expect(setToken).toHaveBeenCalledWith("test_token");
    expect(localStorage.getItem("token")).toBe("test_token");
  });

  test("handles API error", async () => {
    const setToken = jest.fn();
    const logSpy = jest.spyOn(global.console, 'error');
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("test_error"));
    render(<Login setToken={setToken} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(() => screen.getByRole("status")).toThrow();
    expect(setToken).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });
});