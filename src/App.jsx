import {
  Button,
  Input,
  Item,
  Label,
  ListBox,
  Popover,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import Todo from "./components/Todo";
import useTodos from "./hooks/useTodos";
import { useState } from "react";
import { api, apiPost } from "./api";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { IconChevronDown } from "@tabler/icons-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

function App() {
  const { data: todos, isLoading, error } = useTodos();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (newTodo) => {
      return apiPost("/todos", newTodo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });

      resetForm();
      toast.success("Todo added.");
    },
  });

  const { mutate: deleteTodo } = useMutation({
    mutationFn: (id) => {
      return api(`/todos/${id}`, {
        method: "Delete",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
  const [values, setValues] = useState({
    title: "",
    priority: "low",
  });

  const resetForm = () =>
    setValues({
      title: "",
      priority: "low",
    });

  const handleTodo = (e) => {
    e.preventDefault();
    mutate({
      id: nanoid(),
      ...values,
      completed: false,
      createdAt: new Date().toUTCString(),
    });
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <p className="text-sm tracking-wide text-center uppercase text-zinc-500">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return <p>Something went wrong: {error?.message}</p>;
  }
  return (
    <>
      <div className="py-8">
        <div className="container space-y-3">
          {!todos.length ? (
            <p className="font-medium text-center text-orange-500">
              No todos, please add one!
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {todos.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      <div className="container">
        <div className="p-4 bg-white rounded-md">
          <h4 className="mb-4 font-semibold text-center text-blue-950">
            Add
          </h4>
          <form onSubmit={handleTodo} className="space-y-4">
            <TextField
              className="flex flex-col gap-[2px]"
              value={values.title}
              isRequired
              autoComplete="off"
              minLength={3}
              onChange={(value) =>
                setValues({ ...values, title: value })
              }
            >
              <Label className="text-sm font-medium text-zinc-600">
                Title
              </Label>
              <Input
                required
                className="px-3 py-2 text-base transition-shadow bg-white border border-solid rounded-md outline-none border-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-300"
              />
            </TextField>

            <Select
              className="flex flex-col gap-[2px]"
              selectedKey={values.priority}
              onSelectionChange={(key) =>
                setValues({ ...values, priority: key })
              }
            >
              <Label className="text-sm font-medium text-zinc-600">
                Priority
              </Label>
              <Button className="flex items-center justify-between gap-2 px-3 py-2 text-base transition-shadow bg-white border border-solid rounded-md outline-none border-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-300">
                <SelectValue placeholder="Select Priority" />
                <IconChevronDown
                  size={18}
                  className="text-zinc-500"
                />
              </Button>
              <Popover>
                <ListBox className="border border-solid border-zinc-200 bg-white w-[--trigger-width] shadow-lg rounded-md overflow-hidden">
                  <Item
                    id="low"
                    className="px-3 py-2 text-sm font-medium transition-colors bg-white outline-none cursor-pointer focus:bg-zinc-100"
                  >
                    Low
                  </Item>
                  <Item
                    id="medium"
                    className="px-3 py-2 text-sm font-medium transition-colors bg-white outline-none cursor-pointer focus:bg-zinc-100"
                  >
                    Medium
                  </Item>
                  <Item
                    id="high"
                    className="px-3 py-2 text-sm font-medium transition-colors bg-white outline-none cursor-pointer focus:bg-zinc-100"
                  >
                    High
                  </Item>
                </ListBox>
              </Popover>
            </Select>

            <Button
              type="submit"
              isDisabled={isPending}
              className="w-full px-3 py-2 text-base text-white transition-[background-color,box-shadow] bg-blue-700 hover:bg-blue-800 rounded-md outline-none border-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-300"
            >
              {isPending ? "Adding..." : "Add"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
