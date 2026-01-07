import { AxiosAdmin } from "@/config/axios";
import { Eye, Pencil, Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

type Group = {
  id: number;
  name: string;
};
type Subject = {
  id: number;
  name: string;
};
type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
};

type ApiResponse = {
  results?: Group[];
};

const GROUP_STORAGE_KEY = "admin-selected-group-id";

const AdminQeustions = () => {
  const columns = [
    { key: "id", header: "ID", className: "w-16" },
    { key: "group", header: "Group" },
    { key: "subject", header: "Subject" },
    { key: "category", header: "Category" },
    { key: "level", header: "Level" },
    { key: "type", header: "Type" },
    { key: "created_at", header: "Created At" },
    { key: "question", header: "Question" },
    { key: "action", header: "Action", className: "w-32" },
  ];
  const levelOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  // state variables for selects
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [level, setLevel] = useState<string>("");

  // const [level, setLevel] = useState<string>("");
  const [type, setType] = useState<string>("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await AxiosAdmin.get<ApiResponse>("/groups/");
        setGroups(response.data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setGroups([]);
      }
    };

    fetchGroups();
  }, []);







  useEffect(() => {
    const fetchSubjects = async () => {
      const groupParam = groupId ? `?group__id=${groupId}` : "?group__id=1";
      try {
        const response = await AxiosAdmin.get<ApiResponse>(`/subjects/${groupParam}`);
        setSubjects(response.data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [groupId]);


  useEffect(() => {
    const fetchCategory = async () => {
      const groupParam = groupId ? `?group__id=${groupId}` : "?group__id=1";
      const subjectParam = subjectId ? `subject__id=${subjectId}` : "subject__id=1";

      try {
        const response = await AxiosAdmin.get<ApiResponse>(`/categories/list/?${groupParam}&${subjectParam}`);
        setCategories(response.data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setCategories([]);
      }
    };

    fetchCategory();
  }, [groupId, subjectId]);





  useEffect(() => {
    const fetchSubCategory = async () => {
      const groupParam = groupId ? `?group__id=${groupId}` : "?group__id=1";
      const subjectParam = subjectId ? `subject__id=${subjectId}` : "subject__id=1";
      const categoryParam = categoryId ? `category__id=${categoryId}` : "category__id=1";

      try {
        const response = await AxiosAdmin.get<ApiResponse>(`/subcategories/?${groupParam}&${subjectParam}&${categoryParam}`);
        setSubcategories(response.data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setSubcategories([]);
      }
    };

    fetchSubCategory();
  }, [groupId, subjectId, categoryId]);





  useEffect(() => {
    const fetchTableData = async () => {
      const groupParam = groupId ? `?group__id=${groupId}` : "?group__id=1";
      const subjectParam = subjectId ? `subject__id=${subjectId}` : "subject__id=1";
      const categoryParam = categoryId ? `category__id=${categoryId}` : "category__id=1";
      const subcategoryParam = subcategoryId ? `subcategory__id=${subcategoryId}` : "subcategory__id=1";
      const levelParam = level ? `level=${level}` : "level=easy";


      try {
        const response = await AxiosAdmin.get<ApiResponse>(`/dashboard/recent-questions/?${levelParam}&${groupParam}&${subjectParam}&${categoryParam}&${subcategoryParam}`);
        setTableData(response.data?.results ?? []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setTableData([]);
      }
    };

    fetchTableData();
  }, [groupId, subjectId, categoryId,subcategoryId, level]);







  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedGroupId = localStorage.getItem(GROUP_STORAGE_KEY);
    if (storedGroupId) {
      setGroupId(storedGroupId);
    }
  }, []);



  // handle changes for selects below
  const handleGroupChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setGroupId(selectedId);
    if (typeof window !== "undefined") {
      localStorage.setItem(GROUP_STORAGE_KEY, selectedId);
    }
  };

  const handleSubjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSubjectId(selectedId);
  };

const handleCategoryChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setCategoryId(selectedId);
  };

  const handleSubcategoryChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSubcategoryId(selectedId);
  };
  const handleLevelChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setLevel(selectedId);
  };




  const onSubmit = () => {
    // Functionality removed - UI only
  };

  const onReset = () => {
    setGroupId("");
    setSubjectId("");
    setCategoryId("");
    setSubcategoryId("");
    setLevel("");
    setType("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(GROUP_STORAGE_KEY);
      localStorage.removeItem("admin-selected-subject-id");
      localStorage.removeItem("admin-selected-category-id");
      localStorage.removeItem("admin-selected-subcategory-id");
      localStorage.removeItem("admin-selected-level");
      localStorage.removeItem("admin-selected-type");
    }
  };

  const actionCell = (
    <div className="flex items-center gap-3 text-gray-700">
      <button type="button" className="hover:text-gray-900" aria-label="View">
        <Eye className="h-4 w-4" />
      </button>
      <button type="button" className="hover:text-gray-900" aria-label="Edit">
        <Pencil className="h-4 w-4" />
      </button>
      <button type="button" className="hover:text-gray-900" aria-label="Add">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );

  const rows = tableData.length
    ? tableData.map((item) => ({
        id: item?.id ?? "",
        group: item?.group ?? "",
        subject: item?.subject ?? "",
        category: item?.category ?? "",
        level: item?.level ?? "",
        type: item?.type ?? "",
        created_at: item?.created_at ? String(item.created_at).slice(0, 10) : "",
        question: item?.metadata?.question ?? "",
        action: actionCell,
      }))
    : [
        {
          id: "",
          group: "",
          subject: "",
          category: "",
          level: "",
          type: "",
          created_at: "",
          question: "",
          action: actionCell,
        },
      ];

  return (
    <div className="min-w-0">
      <AdminHeader
        title="Question Management"
        subtitle="Filter, manage, and create educational questions."
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={groupId}
            onChange={handleGroupChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled hidden>
              Select group
            </option>
            {groups.map((group) => (
              <option key={group.id} value={String(group.id)}>
                {/* {group.name} */}
                {group.id}
              </option>
            ))}
          </select>


           <select
            value={subjectId}
            onChange={handleSubjectChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled hidden>
              Select subject
            </option>
            {subjects.map((subject) => (
              <option key={subject.id} value={String(subject.id)}>
                {/* {subject.name} */}
                {subject.id}
              </option>
            ))}
          </select>



           <select
            value={categoryId}
            onChange={handleCategoryChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled hidden>
              Select subject
            </option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {/* {category.name} */}
                {category.id}
              </option>
            ))}
          </select>






           <select
            value={subcategoryId}
            onChange={handleSubcategoryChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled hidden>
              Select subcategory
            </option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={String(subcategory.id)}>
                {/* {subcategory.name} */}
                {subcategory.id}
              </option>
            ))}
          </select>




       <select
            value={level}
            onChange={handleLevelChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="" disabled hidden>
              Select subcategory
            </option>
            {levelOptions.map((levelOption) => (
              <option key={levelOption.value} value={String(levelOption.value)}>
                {/* {levelOption.label} */}
                {levelOption.label}
              </option>
            ))}
          </select>






          <button
            type="button"
            onClick={onSubmit}
            className="ml-2 h-9 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-9 rounded-lg border border-gray-400 px-5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        <div className="mt-6">
          <AdminTable
            columns={columns}
            rows={rows}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminQeustions;
