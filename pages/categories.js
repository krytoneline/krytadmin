import { Api, ApiFormData } from "@/services/service";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiChevronDown, FiChevronRight, FiEdit } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { MdOutlineFileUpload } from "react-icons/md";
import isAuth from "@/components/isAuth";
import { useTranslation } from "react-i18next";
import { BiCross } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function Categories(props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [data, setData] = useState({
    name: "",
    image: "",
    type: "",
  });
  const [subData, setSubData] = useState({
    name: "",
    categoryId: "",
    Attribute: [],
  });
  const [loadTypeData, setloadTypeData] = useState([]);
  const [productPopup, setProductPopup] = useState(false);
  const [deleteid, setdeleteid] = useState(null);
  const [editid, seteditid] = useState("");
  const [notAvailableSubCategory, setNotAvailableSubCategory] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const f = useRef(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  // Add attribute
  const [addAttribute, setAddAttribute] = useState([]);
  const [attribute, setAttribute] = useState("");
  const [editAttributeId, setEditAttributeId] = useState("");
  const [mainFilterData, setMainFilterData] = useState([]);

  const handleInput = (e) => {
    setAttribute(e.target.value);
  };

  const inputAttribute = (e) => {
    e.preventDefault();
    if (attribute.trim() === "") return;

    if (editAttributeId) {
      setAddAttribute((prev) =>
        prev.map((item) =>
          item.id === editAttributeId ? { ...item, name: attribute } : item,
        ),
      );
      setEditAttributeId("");
    } else {
      setAddAttribute((prev) => [...prev, { name: attribute, id: Date.now() }]);
    }
    setAttribute("");
  };

  const editAttribute = (id) => {
    const attributeToEdit = addAttribute.find((item) => item.id === id);
    if (attributeToEdit) {
      setAttribute(attributeToEdit.name);
      setEditAttributeId(id);
    }
  };

  const deleteAttribute = (id) => {
    setAddAttribute((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  useEffect(() => {
    getalltrucktype();
  }, []);

  const getalltrucktype = async () => {
    props.loader(true);
    Api("get", "getCategory", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================> form data :: ", res);
        setloadTypeData(res.data);
        setMainFilterData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const submit = (e) => {
    e.preventDefault();

    let method = "post";
    let url = "createCategory";
    data.attributes = addAttribute;
    if (editid) {
      data.id = data._id;
      url = `updateCategory`;
      method = "post";
    }

    Api(method, url, data, router).then(
      (res) => {
        console.log("Post truck type", res);
        setData({
          name: "",
          image: "",
          type: "",
        });
        getalltrucktype();
        seteditid("");
        setAddAttribute([]);
        setNotAvailableSubCategory(false);
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  const submitSubcategory = async (e) => {
    e.preventDefault();
    if (!subData.name || !subData.categoryId) {
      props.toaster({ type: "error", message: "Please fill in all fields." });
      return;
    }

    if (addAttribute.length === 0) {
      return props.toaster({
        type: "error",
        message: "Please add at least one attribute.",
      });
    }

    subData.Attribute = addAttribute;
    const method = subData._id ? "post" : "post";
    const url = subData._id ? `updateSubcategory` : `addSubcategory`;

    try {
      await Api(method, url, subData, router);
      setSubData({ name: "", categoryId: "" });
      setShowSubcategoryForm(false);
      setAddAttribute([]);
      getalltrucktype();
    } catch (err) {
      props.toaster({ type: "error", message: err?.message });
    }
  };

  const deleteCategory = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion?",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#000",
      confirmButtonText: "Delete",
    }).then(function (result) {
      console.log(result);
      if (result.isConfirmed) {
        const data = {
          _id,
        };

        props.loader(true);
        Api("delete", `deleteCategory/${_id}`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);

            getalltrucktype();
            setProductPopup(false);
            setdeleteid(null);
          },
          (err) => {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.meaasge });
            props.toaster({ type: "error", message: err?.meaasge });
          },
        );
      } else if (result.isDenied) {
        // setFullUserDetail({})
      }
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const datas = new FormData();
    datas.append("file", file);
    props.loader(true);
    ApiFormData("post", "/user/fileupload", datas, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          setData({ ...data, image: res.data.file });
          props.toaster({ type: "success", message: res.data.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
    const reader = new FileReader();
    // let key = event.target.name;
    // reader.onloadend = () => {
    //   const base64 = reader.result;
    //   console.log(base64);
    //   // setData({ ...data, img: base64, profile: file });
    // };

    // if (file) {
    //   reader.readAsDataURL(file);
    // }
  };

  const handleCancelSubcategory = () => {
    setSubData({ name: "", categoryId: "" });
    setShowSubcategoryForm(false);
    setAddAttribute([]);
  };

  const deleteSubcategory = async (categoryId, subId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#000",
    });
    const data = {
      categoryId: categoryId,
      subId: subId,
    };
    if (result.isConfirmed) {
      try {
        await Api("delete", `deleteSubcategory`, data, router);
        getalltrucktype();
      } catch (err) {
        props.toaster({ type: "error", message: err?.message });
      }
    }
  };
  const handleEditSubcategory = (subcategory, categoryId, Attribute) => {
    setSubData({
      ...subcategory,
      categoryId: categoryId,
      Attribute: Attribute,
    });
    setShowSubcategoryForm(true);
  };

  const AvailableSubCategoryCategory = loadTypeData.filter(
    (item) => item.notAvailableSubCategory === false,
  );

  return (
    <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <p className="text-white font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">
        {t("categories")}
      </p>

      <section className="h-full w-full overflow-scroll no-scrollbar md:mt-9 mt-5 md:pb-40 pb-32">
        <form
          className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 "
          onSubmit={submit}
        >
          <div className="flex justify-center items-center">
            <img className="h-[112px] w-[112px]" src="/truckImg.png" />
          </div>

          <div className="md:flex flex-col justify-center items-center pt-10">
            <div className="flex flex-col justify-start items-start md:w-auto w-full">
              <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">
                {t("add_categories")}
              </p>
              <input
                className="bg-custom-lightGrayInputBg border border-custom-offWhite outline-none md:h-[50px] h-[40px] md:w-[500px] w-full rounded-[5px] px-5 text-sm font-normal text-black"
                type="text"
                placeholder="Name of Category"
                value={data.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                required
              />
            </div>

            <div className="mt-5 relative">
              <div className="flex flex-col justify-start items-start">
                <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">
                  {t("upload_image")}
                </p>
                <div className="bg-custom-lightGrayInputBg  border border-custom-offWhite md:h-[50px] h-[40px] md:w-[500px] w-full rounded-[5px] px-5 text-sm font-normal text-black flex justify-start items-center">
                  <input
                    type="text"
                    className="bg-custom-lightGrayInputBg outline-none md:w-[90%] w-[85%]"
                    value={data?.image}
                    onChange={(e) => {
                      setData({ ...data, image: e.target.value });
                    }}
                    required
                  />
                </div>
                <div className="absolute top-[30px] md:right-[10px] right-[10px]">
                  <MdOutlineFileUpload
                    className="text-black h-8 w-8 cursor-pointer"
                    onClick={() => {
                      f.current.click();
                    }}
                  />
                  <input
                    type="file"
                    ref={f}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start md:w-auto w-full mt-5">
                <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">
                  {t("Category Type")}
                </p>
                <div className="relative bg-custom-lightGrayInputBg border border-custom-offWhite rounded-[5px]">
                  <select
                    className="bg-transparent outline-none md:h-[50px] h-[40px] md:w-[500px] w-[310px] px-5  text-sm font-normal text-black"
                    type="text"
                    placeholder={t("Category Type")}
                    value={data.type}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        type: newValue.target.value,
                      });
                    }}
                    required
                  >
                    <option value="" className="p-5">
                      {t("Category Type")}
                    </option>
                    <option value="Products" className="p-5">
                      {t("Products")}
                    </option>
                    <option value="Business" className="p-5">
                      {t("Business")}
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex my-2 justify-start gap-8 mt-5">
                <input
                  type="checkbox"
                  value="notAvailableCategory"
                  checked={notAvailableSubCategory}
                  onChange={(e) => {
                    setNotAvailableSubCategory(e.target.checked); // ✅ gives true or false
                  }}
                  className="w-4 h-4"
                />
                <label className="text-gray-700">
                  Subcategories Not Available
                </label>
              </div>

              {notAvailableSubCategory && (
                <div className="mt-5">
                  <p className="text-custom-lightGrayInputName font-semibold text-sm pb-1 ">
                    {t("attribute")}
                  </p>
                  <div className="flex gap-3 ">
                    <input
                      className="border rounded-md text-black  bg-custom-lightGrayInputBg border-custom-offWhite px-4 outline-none md:w-full w-full"
                      type="text"
                      value={attribute}
                      onChange={handleInput}
                    />
                    <button
                      className="bg-custom-red px-5 font-semibold rounded-md py-3 text-white"
                      onClick={inputAttribute}
                    >
                      {editAttributeId ? t("update") : t("add")}
                    </button>
                  </div>

                  <div className="mt-5">
                    <ul>
                      {addAttribute?.map((item, id) => (
                        <div className="flex border w-full justify-between rounded-md bg-custom-lightGrayInputBg my-4 py-1 items-center px-2">
                          <li key={id} className="text-black font-bold">
                            {item?.name}
                          </li>
                          <div className="flex text-2xl gap-2 pt-1">
                            <FiEdit
                              className="text-gray-500 mt-[0.5px]  cursor-pointer"
                              onClick={() => editAttribute(item.id)}
                            />
                            <IoCloseCircleOutline
                              className="text-custom-darkGray text-3xl cursor-pointer"
                              onClick={() => deleteAttribute(item.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center pt-10 pb-3">
            <button
              className="md:h-[50px] h-[40px] md:w-[274px] w-full bg-custom-red rounded-[10px] md:text-lg text-base text-white font-bold"
              type="submit"
            >
              {data?._id ? t("update") : t("submit")}
            </button>
            {!showSubcategoryForm && (
              <div className="mb-5 mt-2">
                <button
                  className="md:h-[50px] h-[40px] md:w-[274px] w-[310px] bg-custom-red rounded-[10px] md:text-lg text-base text-white font-bold"
                  onClick={() => {
                    setShowSubcategoryForm(!showSubcategoryForm);
                    setAddAttribute([]);
                    setData({ name: "", image: "", type: "" });
                    setNotAvailableSubCategory(false)
                  }}
                >
                  {showSubcategoryForm ? t("Cancel") : t("Add Subcategory")}
                </button>
              </div>
            )}
          </div>
        </form>

        <div className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 mt-5">
          <input
            className="bg-custom-lightGrayInputBg border border-custom-lightGrayColor outline-none h-[40px] md:w-[435px] w-full px-5 rounded-[10px] text-black font-semibold	text-base"
            type="text"
            placeholder="Search Load"
            onChange={(text) => {
              const d = mainFilterData.filter((f) =>
                f.name.toLowerCase().includes(text?.target.value.toLowerCase()),
              );
              setloadTypeData(d);
            }}
          />
        </div>

        {loadTypeData.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 mt-5"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-start items-center">
                <input
                  className="md:h-[30px] h-[15px] md:w-[30px] w-[15px]"
                  type="checkbox"
                />
                <p className={`text-base text-black font-semibold pl-5`}>
                  {item?.name}
                </p>
              </div>
              <div className="flex justify-center items-center">
                {item.Subcategory && item.Subcategory.length > 0 && (
                  <div
                    className="mr-3 cursor-pointer"
                    onClick={() => toggleCategoryExpansion(item._id)}
                  >
                    {expandedCategories[item._id] ? (
                      <IoIosArrowDown size={28} className=" text-black" />
                    ) : (
                      <IoIosArrowUp size={28} className=" text-black" />
                    )}
                  </div>
                )}
                <FiEdit
                  size={28}
                  className={`text-black mr-[20px] cursor-pointer`}
                  onClick={() => {
                    (seteditid(item._id), setData(item));
                    setAddAttribute(item.attributes);
                    setNotAvailableSubCategory(item.notAvailableSubCategory);
                  }}
                />
                <IoCloseCircleOutline
                  size={28}
                  className={` text-black cursor-pointer`}
                  onClick={() => {
                    deleteCategory(item?._id);
                  }}
                />
              </div>
            </div>

            {expandedCategories[item._id] &&
              item.Subcategory &&
              item.Subcategory.length > 0 && (
                <div className="mt-3 ml-8">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Subcategories:
                  </h4>
                  {item.Subcategory.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex justify-between items-center bg-gray-100 border border-gray-200 rounded-[5px] p-3 mt-2"
                    >
                      <p className="text-black font-medium">{sub.name}</p>
                      <div className="flex">
                        <FiEdit
                          size={24}
                          className="text-black mr-[15px] cursor-pointer"
                          onClick={() => {
                            setAddAttribute(sub.Attribute);
                            handleEditSubcategory(sub, item._id, sub.Attribute);
                          }}
                        />
                        <IoCloseCircleOutline
                          size={24}
                          className="text-black cursor-pointer"
                          onClick={() => deleteSubcategory(item._id, sub._id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}

        {showSubcategoryForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              className="bg-white w-[90%] max-w-[550px] rounded-[10px] p-6 shadow-xl flex flex-col"
              onSubmit={submitSubcategory}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-black font-semibold mb-4">
                  {subData._id ? "Update Subcategory" : "Add Subcategory"}
                </h2>
                <RxCross2
                  onClick={handleCancelSubcategory}
                  className="text-black text-2xl cursor-pointer"
                />
              </div>

              <select
                className="bg-gray-100 text-black border border-custom-offWhite outline-none h-[45px] w-full rounded-[5px] px-4 text-sm mb-3"
                value={subData.categoryId}
                onChange={(e) =>
                  setSubData({ ...subData, categoryId: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {AvailableSubCategoryCategory.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                className="bg-gray-100 border border-custom-offWhite outline-none h-[45px] w-full rounded-[5px] px-4 text-sm mb-4 text-black"
                type="text"
                placeholder="Name of Subcategory"
                value={subData.name}
                onChange={(e) =>
                  setSubData({ ...subData, name: e.target.value })
                }
                required
              />

              <p className="text-gray-600 font-semibold text-sm mb-1">
                Attribute
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  className="flex-1 bg-gray-100 text-black border border-custom-offWhite rounded-md px-4 outline-none h-[45px]"
                  type="text"
                  value={attribute}
                  placeholder="Enter Attribute"
                  onChange={handleInput}
                />
                <button
                  type="button"
                  className="bg-black px-5 rounded-md text-white font-semibold"
                  onClick={inputAttribute}
                >
                  Add
                </button>
              </div>

              <div className="max-h-[150px] overflow-y-auto mb-4">
                {addAttribute?.map((item, id) => (
                  <div
                    key={id}
                    className="flex justify-between items-center bg-gray-100 rounded-md px-3 py-2 mb-2"
                  >
                    <span className="text-sm text-black font-semibold">
                      {item?.name}
                    </span>
                    <IoCloseCircleOutline
                      className="text-gray-600 text-2xl cursor-pointer"
                      onClick={() => deleteAttribute(item.id)}
                    />
                  </div>
                ))}
              </div>

              <button
                className="h-[45px] w-full bg-black rounded-[8px] text-white font-semibold"
                type="submit"
              >
                {subData._id ? "Update Subcategory" : "Add Subcategory"}
              </button>

              <button
                type="button"
                className="h-[45px] w-full border bg-gray-200 text-black border-gray-300 rounded-[8px] mt-3 font-semibold"
                onClick={handleCancelSubcategory}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </section>
    </section>
  );
}

export default isAuth(Categories);
