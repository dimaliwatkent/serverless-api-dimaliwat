import React, { useEffect, useState } from "react";
import axios from "axios";

const DataForm = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://dimaliwatkent-authors-api.netlify.app/.netlify/functions/api/",
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age) {
      setError("Name and age are required");
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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />

        <button type="submit">{editItem ? "Update Data" : "Add Data"}</button>
      </form>
      {error && <p>{error}</p>}

      {
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.name} - {item.age}
              <button onClick={() => handleEdit(item._id)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default DataForm;
