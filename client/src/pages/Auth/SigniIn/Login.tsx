import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Anchor,
  Stack,
} from "@mantine/core";
import { GoogleButton } from "../LogoSignIn/GoogleButton";
import { login, register } from "../../../services/Auth/auth";
import { useNavigate } from "react-router-dom";
import type { Login, Register } from "../../../interfaces/Auth/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { GoogleLogin } from "react-google-login";

export function Login() {
  const client_api = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const [type, toggle] = useToggle(["login", "register"]);

  const LoginForm = useForm<Login>({
    initialValues: {
      email: "test1@gmail.com",
      password: "test",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 2
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleLoginSuccess = async (response: any) => {
    // Extract the token from the response
    const { tokenId } = response;

    console.log("token", tokenId);

    try {
      // Send the token to the backend to get the JWT using axios
      const res = await axios.get("api/auth/google", {
        headers: {
          Authorization: `Bearer ${tokenId}`,
        },
      });

      // Store the JWT in localStorage or state
      localStorage.setItem("token", res.data.token);
      // Handle successful login
      console.log("Login successful", res.data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const RegisterForm = useForm<Register>({
    initialValues: {
      username: "Jengs",
      email: "test1@gmail.com",
      password: "test",
    },
    validate: {
      username: (val) =>
        val.length <= 2 ? "Name should include at least 3 characters" : null,
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 2
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const handleSubmitLogin = async (values: Login) => {
    try {
      await login(values.email, values.password);
      const token = localStorage.getItem("accessToken");
      const decodedToken: { role?: number } = jwtDecode(token || "");
      const userRole = Number(decodedToken.role);

      userRole === 1 ? navigate("/users") : navigate("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      LoginForm.setErrors({
        email: "Login failed. Please check your credentials.",
      });
    }
  };

  const handleSubmitRegister = async (values: Register) => {
    try {
      await register(values.username, values.email, values.password);
      toggleType();
    } catch (error) {
      console.error("Register failed:", error);
      RegisterForm.setErrors({
        email: "Register failed. Please check your credentials.",
      });
    }
  };

  const toggleType = () => {
    toggle();
    LoginForm.reset();
    RegisterForm.reset();
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" fw={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton
          radius="xl"
          onClick={() => {
            window.location.href = "http://localhost:8000/api/auth/google";
          }}
        >
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form
        onSubmit={
          type === "login"
            ? LoginForm.onSubmit(handleSubmitLogin)
            : RegisterForm.onSubmit(handleSubmitRegister)
        }
      >
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={RegisterForm.values.username}
              onChange={(event) =>
                RegisterForm.setFieldValue(
                  "username",
                  event.currentTarget.value
                )
              }
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={
              type === "login"
                ? LoginForm.values.email
                : RegisterForm.values.email
            }
            onChange={(event) =>
              type === "login"
                ? LoginForm.setFieldValue("email", event.currentTarget.value)
                : RegisterForm.setFieldValue("email", event.currentTarget.value)
            }
            error={
              type === "login"
                ? LoginForm.errors.email && "Invalid email"
                : RegisterForm.errors.email && "Invalid email"
            }
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={
              type === "login"
                ? LoginForm.values.password
                : RegisterForm.values.password
            }
            onChange={(event) =>
              type === "login"
                ? LoginForm.setFieldValue("password", event.currentTarget.value)
                : RegisterForm.setFieldValue(
                    "password",
                    event.currentTarget.value
                  )
            }
            error={
              type === "login"
                ? LoginForm.errors.password &&
                  "Password should include at least 6 characters"
                : RegisterForm.errors.password &&
                  "Password should include at least 6 characters"
            }
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={toggleType}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
