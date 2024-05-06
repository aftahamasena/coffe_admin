import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";

class Item extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      id: "",
      name: "",
      size: "",
      price: "",
      image: "",
      action: "",
      search: "",
      showModal: false,
      searchName: "",
    };
  }

  bind = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  Add = () => {
    this.setState({
      id: "",
      name: "",
      size: "",
      price: "",
      image: "",
      action: "insert",
      showModal: true,
    });
  };

  Edit = (item) => {
    this.setState({
      id: item.id,
      name: item.name,
      size: item.size,
      price: item.price,
      image: item.image,
      action: "update",
      showModal: true,
    });
  };

  Drop = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      axios
        .delete(`http://172.16.100.39:8000/coffee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          this.getitems();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  Saveitem = (event) => {
    event.preventDefault();
    let url = "";
    let form = new FormData();
    form.append("name", this.state.name);
    form.append("size", this.state.size);
    form.append("price", this.state.price);
    form.append("image", this.state.image); // Assuming this.state.image contains the File object

    if (this.state.action === "insert") {
      url = "http://172.16.100.39:8000/coffee";
      axios
        .post(url, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          this.getitems();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (this.state.action === "update") {
      url = `http://172.16.100.39:8000/coffee/${this.state.id}`;
      axios
        .put(url, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        })
        .then((response) => {
          alert(response.data.message);
          this.getitems();
        })
        .catch((error) => {
          console.log(error);
        });
    }

    this.setState({
      action: "",
      id: "",
      name: "",
      size: "",
      price: "",
      image: "",
      showModal: false,
    });
  };

  getitems = () => {
    let url = "http://172.16.100.39:8000/coffee";
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    };

    if (this.state.searchName !== "") {
      url += `?search=${this.state.searchName}`;
    }

    axios
      .get(url, config)
      .then((response) => {
        this.setState({ items: response.data.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getitems();
  }

  render() {
    return (
      <div className="m-3 card text-sm px-12">
        <div className="card-header bg-info text-white">Data item Kopi</div>
        <div className="card-body">
          <div className="flex justify-between mb-2">
            <input
              type="text"
              className="form-control border rounded-2xl pl-3"
              name="searchName"
              value={this.state.searchName}
              onChange={this.bind}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.getitems(); // Panggil fungsi getitems saat tombol "Enter" ditekan
                }
              }}
              style={{ width: "250px" }} // Ubah lebar input sesuai kebutuhan
              placeholder="Cari berdasar nama Item . . . ."
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={this.Add}
            >
              Tambah item
            </button>
          </div>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Nama</th>
                <th className="border px-4 py-2 text-left">Size</th>
                <th className="border px-4 py-2 text-left">Harga</th>
                <th className="border px-4 py-2 text-left">Gambar</th>
                <th className="border px-4 py-2 text-left">Opsi</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items &&
                this.state.items.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.size}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">{item.image}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                        onClick={() => this.Edit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => this.Drop(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {this.state.showModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-black opacity-60"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-bold text-gray-900 mb-5"
                          id="modal-title"
                        >
                          Form item Kopi
                        </h3>
                        <div className="mt-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <label htmlFor="name">Nama</label>
                              <input
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.name}
                                onChange={this.bind}
                                className="form-control border rounded-md pl-1"
                                required
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="size">Size</label>
                              <input
                                type="text"
                                id="size"
                                name="size"
                                value={this.state.size}
                                onChange={this.bind}
                                className="form-control border rounded-md pl-1"
                                required
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="price">Harga</label>
                              <input
                                type="text"
                                id="price"
                                name="price"
                                value={this.state.price}
                                onChange={this.bind}
                                className="form-control border rounded-md pl-1"
                                required
                              />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="image">Gambar</label>
                              <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={(event) =>
                                  this.setState({
                                    image: event.target.files[0],
                                  })
                                }
                                className="form-control border rounded-md pl-1"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={this.Saveitem}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => this.setState({ showModal: false })}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Item;
