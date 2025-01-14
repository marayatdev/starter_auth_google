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
  Flex,
} from "@mantine/core";
import { GoogleButton } from "../LogoSignIn/GoogleButton";
import { login, register } from "../../../services/Auth/auth";
import { useNavigate } from "react-router-dom";
import type { Login, Register } from "../../../interfaces/Auth/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect } from "react";

export function Login() {
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

  const RegisterForm = useForm<Register>({
    initialValues: {
      username: "admin Jengs marayat ",
      email: "admin@gmail.com",
      password: "",
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

  let clickCount = 0;

  const toggleType = () => {
    clickCount += 1;
    if (clickCount === 3) {
      toggle();
      LoginForm.reset();
      RegisterForm.reset();
      clickCount = 0;
    }
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
      <Divider
        label="Or continue with email"
        onClick={toggleType}
        labelPosition="center"
        my="lg"
      />

      <Flex justify="center" align="center">
        {type === "register" && (
          <Text fz={"h1"} c={"red"}>
            {" "}
            Admin Register
          </Text>
        )}
      </Flex>

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
            {/* {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"} */}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
