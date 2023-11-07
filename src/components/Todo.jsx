import clsx from "clsx";
import {
  IconCheck,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import {
  Button,
  Dialog,
  Item,
  ListBox,
  Modal,
  Popover,
  SelectValue,
  Input,
  Label,
  TextField,
  Select,
  ModalOverlay,
} from "react-aria-components";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiPatch } from "../api";
import { toast } from "sonner";

export default function Todo(props) {
  const { todo = {}, onDelete = {} } = props;
  const [modalOpen, setModalOpen] = useState(false);

  const iconClass = clsx(
    "flex items-center justify-center outline-none focus:ring focus:ring-blue-100  w-6 h-6 text-gray-500 transition-[box-shadow,background-color] rounded-md ",
    todo.completed
      ? "bg-green-50 hover:bg-green-100"
      : "bg-white hover:bg-slate-100",
    "disabled:text-gray-300"
  );

  const initialValues = {
    title: todo.title,
    priority: todo.priority,
  };

  const [values, setValues] = useState({
    ...initialValues,
  });

  const queryClient = useQueryClient();

  //   Update todo
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, values }) => {
      return apiPatch(`/todos/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      setModalOpen(false);
      toast.success("Todo updated.");
    },
  });

  const {
    mutate: markAsComplete,
    isPending: markingAsComplete,
  } = useMutation({
    mutationFn: ({ id, values }) => {
      return apiPatch(`/todos/${id}`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      toast.success("Todo marked as completed.");
    },
  });

  const handleTodo = (e) => {
    e.preventDefault();

    mutate({ id: todo.id, values });
  };

  return (
    <div
      className={clsx(
        "border rounded-md border-slate-300",
        todo.completed
          ? "border-green-500 bg-green-50"
          : "bg-white"
      )}
    >
      <div className="flex items-start gap-3 px-3 py-5">
        <div
          className={clsx(
            "h-2 w-2 rounded-full relative top-[5px]",
            todo.priority === "low"
              ? "bg-green-600"
              : todo.priority === "medium"
              ? "bg-orange-600"
              : "bg-red-600"
          )}
        />
        <h3 className="flex-1 text-sm font-medium">
          {todo.title}
        </h3>
      </div>
      <div
        className={clsx(
          "flex items-center justify-end gap-4 p-1 border-t  rounded-b-md",
          todo.completed
            ? "border-green-200"
            : "border-slate-100"
        )}
      >
        <Button
          className={iconClass}
          isDisabled={todo.completed}
          onPress={() => setModalOpen(true)}
        >
          <IconEdit size={16} className="text-current" />
        </Button>

        <ModalOverlay
          isDismissable
          isOpen={modalOpen}
          onOpenChange={(value) => setModalOpen(!value)}
          className={({
            isEntering,
            isExiting,
          }) => `fixed inset-0 z-10 flex items-center justify-center min-h-full p-4 overflow-y-auto text-center bg-black/60 backdrop-blur-sm  ${
            isEntering
              ? "animate-in fade-in duration-300 ease-out"
              : ""
          }
          ${
            isExiting
              ? "animate-out fade-out duration-200 ease-in"
              : ""
          }`}
        >
          <Modal
            className={({
              isEntering,
              isExiting,
            }) => `w-full bg-white rounded-md shadow-md  ${
              isEntering
                ? "animate-in zoom-in-95 ease-out duration-300"
                : ""
            }
            ${
              isExiting
                ? "animate-out zoom-out-95 ease-in duration-200"
                : ""
            }`}
          >
            <Dialog className="relative p-5 outline-none">
              <Button
                onPress={() => setModalOpen(false)}
                className="absolute transition-shadow rounded-md outline-none right-2 top-2 focus-visible:ring focus-visible:ring-blue-100"
              >
                <IconX
                  size={18}
                  className="text-zinc-500"
                />
              </Button>
              <form
                onSubmit={handleTodo}
                className="space-y-4"
              >
                <TextField
                  className="flex flex-col gap-[2px]"
                  value={values.title}
                  isRequired
                  minLength={3}
                  onChange={(value) =>
                    setValues({
                      ...values,
                      title: value,
                    })
                  }
                >
                  <Label className="text-sm font-medium text-start text-zinc-600">
                    First name
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
                    setValues({
                      ...values,
                      priority: key,
                    })
                  }
                >
                  <Label className="text-sm font-medium text-start text-zinc-600">
                    Favorite Animal
                  </Label>
                  <Button className="flex items-center justify-between gap-2 px-3 py-2 text-base transition-shadow bg-white border border-solid rounded-md outline-none border-zinc-300 focus-visible:ring-1 focus-visible:ring-blue-300">
                    <SelectValue placeholder="Select Priority" />
                    <IconChevronDown
                      size={18}
                      className="text-zinc-500"
                    />
                  </Button>
                  <Popover>
                    <ListBox className="bg-white w-[--trigger-width] shadow-lg rounded-md overflow-hidden">
                      <Item
                        id="low"
                        className="px-3 py-2 text-sm font-medium bg-white outline-none cursor-pointer hover:bg-zinc-200"
                      >
                        Low
                      </Item>
                      <Item
                        id="medium"
                        className="px-3 py-2 text-sm font-medium bg-white outline-none cursor-pointer hover:bg-zinc-200"
                      >
                        Medium
                      </Item>
                      <Item
                        id="high"
                        className="px-3 py-2 text-sm font-medium bg-white outline-none cursor-pointer hover:bg-zinc-200"
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
                  {isPending ? "Updating..." : "Update"}
                </Button>
              </form>
            </Dialog>
          </Modal>
        </ModalOverlay>

        {!todo.completed ? (
          <Button
            className={iconClass}
            isDisabled={markingAsComplete}
          >
            <IconCheck
              size={16}
              className="text-current"
              onClick={() =>
                markAsComplete({
                  id: todo.id,
                  values: {
                    completed: true,
                  },
                })
              }
            />
          </Button>
        ) : null}

        <Button onPress={onDelete} className={iconClass}>
          <IconTrash size={16} className="text-current" />
        </Button>
      </div>
    </div>
  );
}
