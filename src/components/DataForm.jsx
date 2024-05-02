import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const DataForm = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://dimaliwatkent-authors-api.netlify.app/.netlify/functions/api/",
      )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age) {
      setError("Name and age are required!");
      setTimeout(() => {
        setError(null); // Clear the error message after 5 seconds
      }, 5000);
      return;
    }
    const url = editItem
      ? `https://dimaliwatkent-authors-api.netlify.app/.netlify/functions/api/${editItem._id}`
      : "https://dimaliwatkent-authors-api.netlify.app/.netlify/functions/api/";
    const method = editItem ? "put" : "post";

    // POST or PUT request
    axios[method](url, { name, age })
      .then((response) => {
        console.log(response.data);

        if (editItem) {
          setData(
            data.map((item) =>
              item._id === editItem._id ? response.data : item,
            ),
          );
        } else {
          setData([...data, response.data.author]);
        }
        setName("");
        setAge("");
        setError(null);
        setEditItem(null);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const handleEdit = (_id) => {
    const itemToEdit = data.find((item) => item._id === _id);
    setEditItem(itemToEdit);
    setName(itemToEdit.name);
    setAge(itemToEdit.age);
  };

  const handleDelete = (_id) => {
    axios
      .delete(
        `https://dimaliwatkent-authors-api.netlify.app/.netlify/functions/api/${_id}`,
      )
      .then(() => {
        setData(data.filter((item) => item._id !== _id));
      })
      .catch((error) => {
        console.error(("There was an error!", error));
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full max-w-3xl items-center space-x-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <Input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />

          <Button type="submit">{editItem ? "Update Data" : "Add Data"}</Button>
        </div>
      </form>
      {error && <p className="text-red-500 ">{error}</p>}
      <Separator className="my-3" />
      {isLoading ? (
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-4">
          {data.map((item) => (
            <li key={item.id} className="w-50 p-2 rounded-md bg-card">
              <h3 className="text-lg font-bold">{item.name}</h3>
              <h4 className="text-sm text-gray-400">{item.age} years old</h4>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(item._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataForm;
