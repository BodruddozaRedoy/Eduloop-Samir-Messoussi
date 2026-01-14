import { AxiosAdmin } from "@/config/axios";
import axios from "axios";
import { Eye, Pencil, Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminHeader from "../components/AdminHeader";
import { AdminSearch } from "../components/AdminControls";
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

type ListResponse<T> = {
  results?: T[];
};

type RecentQuestionsResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: RecentQuestion[];
};

type RecentQuestion = {
  id?: number;
  group?: string;
  subject?: string;
  category?: string;
  subcategory?: string;
  level?: string;
  type?: string;
  created_at?: string;
  metadata?: {
    question?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const AdminQeustions = () => {
  const navigate = useNavigate();
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
    { value: "advance", label: "Advance" },
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
  const [tableData, setTableData] = useState<RecentQuestion[]>([]);
  const [level, setLevel] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [lastRequestUrl, setLastRequestUrl] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchGroups = async () => {
      const controller = new AbortController();
      try {
        const response = await AxiosAdmin.get<ApiResponse>("/groups/", {
          signal: controller.signal,
        });
        setGroups(response.data?.results ?? []);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;
        console.error("Failed to fetch groups:", error);
        setGroups([]);
      }
    };

    fetchGroups();
  }, []);







  useEffect(() => {
    const controller = new AbortController();
    const fetchSubjects = async () => {
      if (!groupId) {
        setSubjects([]);
        return;
      }
      setLoadingSubjects(true);
      try {
        const response = await AxiosAdmin.get<ListResponse<Subject>>(
          `/subjects/?group__id=${encodeURIComponent(groupId)}`,
          { signal: controller.signal }
        );
        setSubjects(response.data?.results ?? []);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;
        console.error("Failed to fetch subjects:", error);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
    return () => controller.abort();
  }, [groupId]);


  useEffect(() => {
    const controller = new AbortController();
    const fetchCategory = async () => {
      if (!groupId || !subjectId) {
        setCategories([]);
        return;
      }
      setLoadingCategories(true);

      try {
        const response = await AxiosAdmin.get<ListResponse<Category>>(
          `/categories/list/?group__id=${encodeURIComponent(groupId)}&subject__id=${encodeURIComponent(
            subjectId
          )}`,
          { signal: controller.signal }
        );
        setCategories(response.data?.results ?? []);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;
        console.error("Failed to fetch subjects:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategory();
    return () => controller.abort();
  }, [groupId, subjectId]);





  useEffect(() => {
    const controller = new AbortController();
    const fetchSubCategory = async () => {
      if (!groupId || !subjectId || !categoryId) {
        setSubcategories([]);
        return;
      }
      setLoadingSubcategories(true);

      try {
        const response = await AxiosAdmin.get<ListResponse<Subcategory>>(
          `/subcategories/?group__id=${encodeURIComponent(groupId)}&subject__id=${encodeURIComponent(
            subjectId
          )}&category__id=${encodeURIComponent(categoryId)}`,
          { signal: controller.signal }
        );
        setSubcategories(response.data?.results ?? []);
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;
        console.error("Failed to fetch subjects:", error);
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubCategory();
    return () => controller.abort();
  }, [groupId, subjectId, categoryId]);





  useEffect(() => {
    const controller = new AbortController();
    const debounceMs = 200;
    const fetchTableData = async () => {
      try {
        setLoadingTable(true);
        const params = new URLSearchParams();
        if (page > 1) params.set("page", String(page));
        if (createdAt) params.set("created_at", createdAt);
        if (level) params.set("level", level);
        // Backend appears to use Django-style filter keys (seen in `next` URLs)
        if (groupId) params.set("group__id", groupId);
        if (subjectId) params.set("subject__id", subjectId);
        if (categoryId) params.set("category__id", categoryId);
        if (subcategoryId) params.set("subcategory__id", subcategoryId);
        const trimmedSearch = search.trim();
        if (trimmedSearch) params.set("search", trimmedSearch);

        const query = params.toString();
        const url = query
          ? `/dashboard/recent-questions/?${query}`
          : "/dashboard/recent-questions/";

        setLastRequestUrl(url);

        const response = await AxiosAdmin.get<RecentQuestionsResponse>(url, {
          signal: controller.signal,
        });
        setTableData(response.data?.results ?? []);
        setTotalCount(response.data?.count ?? 0);
        setHasNextPage(Boolean(response.data?.next));
        setHasPrevPage(Boolean(response.data?.previous));
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") return;
        console.error("Failed to fetch questions:", error);
        setTableData([]);
        setTotalCount(0);
        setHasNextPage(false);
        setHasPrevPage(false);
      } finally {
        setLoadingTable(false);
      }
    };

    const t = setTimeout(fetchTableData, debounceMs);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [groupId, subjectId, categoryId, subcategoryId, level, createdAt, page, search]);


  // handle changes for selects below
  const handleGroupChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setGroupId(selectedId);
    setSubjectId("");
    setCategoryId("");
    setSubcategoryId("");
    setSubjects([]);
    setCategories([]);
    setSubcategories([]);
    setPage(1);
  };

  const handleSubjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSubjectId(selectedId);
    setCategoryId("");
    setSubcategoryId("");
    setCategories([]);
    setSubcategories([]);
    setPage(1);
  };

const handleCategoryChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setCategoryId(selectedId);
    setSubcategoryId("");
  setSubcategories([]);
    setPage(1);
  };

  const handleSubcategoryChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSubcategoryId(selectedId);
    setPage(1);
  };
  const handleLevelChange= (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setLevel(selectedId);
    setPage(1);
  };

  const handleCreatedAtChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setCreatedAt(selectedValue);
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
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
    setCreatedAt("");
    setPage(1);
  };

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
        action: (
          <div className="flex items-center gap-3 text-gray-700">
            <button
              type="button"
              className="hover:text-gray-900"
              aria-label="View"
              onClick={() =>
                navigate(`/admin/questions/${item?.id}`, {
                  state: { question: item },
                })
              }
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hover:text-gray-900"
              aria-label="Edit"
              onClick={() =>
                navigate(`/admin/questions/${item?.id}`, {
                  state: { question: item },
                })
              }
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="hover:text-gray-900"
              aria-label="Add"
              onClick={() =>
                navigate(`/admin/questions/${item?.id}`, {
                  state: { question: item },
                })
              }
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ),
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
          action: null,
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
          <AdminSearch
            placeholder="Search questions"
            value={search}
            onChange={handleSearchChange}
          />
          <select
            value={groupId}
            onChange={handleGroupChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All groups</option>
            {groups.map((group) => (
              <option key={group.id} value={String(group.id)}>
                {/* {group.name} */}
                {group.name}
              </option>
            ))}
          </select>


           <select
            value={subjectId}
            onChange={handleSubjectChange}
            disabled={!groupId || loadingSubjects}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={String(subject.id)}>
                {/* {subject.name} */}
                {subject.name}
              </option>
            ))}
          </select>



           <select
            value={categoryId}
            onChange={handleCategoryChange}
            disabled={!groupId || !subjectId || loadingCategories}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {/* {category.name} */}
                {category.name}
              </option>
            ))}
          </select>






           <select
            value={subcategoryId}
            onChange={handleSubcategoryChange}
            disabled={!groupId || !subjectId || !categoryId || loadingSubcategories}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All subcategories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={String(subcategory.id)}>
                {/* {subcategory.name} */}
                {subcategory.name}
              </option>
            ))}
          </select>




       <select
            value={level}
            onChange={handleLevelChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All levels</option>
            {levelOptions.map((levelOption) => (
              <option key={levelOption.value} value={String(levelOption.value)}>
                {/* {levelOption.label} */}
                {levelOption.label}
              </option>
            ))}
          </select>

          <select
            value={createdAt}
            onChange={handleCreatedAtChange}
            className="h-9 min-w-[160px] rounded-lg border border-gray-300 px-3 text-sm text-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Created at (default)</option>
            <option value="0">created_at=0</option>
            <option value="1">created_at=1</option>
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
          {loadingTable ? (
            <div className="mb-3 text-xs text-gray-500">Loading questions…</div>
          ) : null}
          {lastRequestUrl ? (
            <div className="mb-3 text-[11px] text-gray-400 break-all">
              Request: {lastRequestUrl}
            </div>
          ) : null}
          <AdminTable
            columns={columns}
            rows={rows}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Total: {totalCount} • Page: {page}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || !hasPrevPage}
                className="h-9 rounded-lg border border-gray-400 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="h-9 rounded-lg bg-orange-600 px-4 text-xs font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQeustions;
