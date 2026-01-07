import { AxiosAdmin } from "@/config/axios";
import { Eye, Pencil, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminSelect } from "../components/AdminControls";
import AdminHeader from "../components/AdminHeader";
import AdminTable from "../components/AdminTable";

type ApiListResponse<T> = {
  results?: T[];
};

type Id = number | string;
type Group = { id: Id; name?: string; title?: string; group?: string };
type Subject = { id: Id; name?: string; title?: string; subject?: string };
type Category = { id: Id; name?: string; title?: string; category?: string };
type Subcategory = { id: Id; name?: string; title?: string; subcategory?: string };

const uniqueById = <T extends { id?: Id }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (item?.id === undefined || item?.id === null) return true;
    const key = String(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const uniqueOptionsByLabel = (options: Array<{ value: string; label: string }>) => {
  const seen = new Set<string>();
  return options.filter((o) => {
    const key = o.label.trim().toLowerCase();
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getName = (item: { name?: string }) => (item.name ?? "").toString().trim();

type Question = {
  id: number;
  group?: string;
  subject?: string;
  category?: string;
  subcategory?: string;
  level?: string;
  type?: string;
  created_at?: string;
  metadata?: { question?: string };
};

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

  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [groupId, setGroupId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [subcategoryRequestId, setSubcategoryRequestId] = useState(0);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await AxiosAdmin.get<ApiListResponse<Group>>("/groups/");
        setGroups(uniqueById(res.data?.results ?? []));
      } catch {
        setGroups([]);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!groupId) {
        setSubjects([]);
        return;
      }

      try {
        const res = await AxiosAdmin.get<ApiListResponse<Subject>>(
          "/subjects/",
          { params: { group_id: Number(groupId) } }
        );
        setSubjects(uniqueById(res.data?.results ?? []));
      } catch {
        setSubjects([]);
      }
    };

    setSubjectId("");
    setCategoryId("");
    setSubcategoryId("");
    setCategories([]);
    setSubcategories([]);
    loadSubjects();
  }, [groupId]);

  useEffect(() => {
    const loadCategories = async () => {
      if (!groupId || !subjectId) {
        setCategories([]);
        return;
      }

      try {
        const res = await AxiosAdmin.get<ApiListResponse<Category>>("/categories/list", {
          params: {
            group_id: Number(groupId),
            subject__id: Number(subjectId),
            subject_id: Number(subjectId),
          },
        });
        setCategories(uniqueById(res.data?.results ?? []));
      } catch {
        setCategories([]);
      }
    };

    setCategoryId("");
    setSubcategoryId("");
    setSubcategories([]);
    loadCategories();
  }, [groupId, subjectId]);

  useEffect(() => {
    const currentRequestId = Date.now();
    setSubcategoryRequestId(currentRequestId);
    setSubcategoryId("");
    setSubcategories([]);

    if (!groupId || !subjectId || !categoryId) {
      return;
    }

    const loadSubcategories = async () => {
      const params = {
        group_id: Number(groupId),
        subject_id: Number(subjectId),
        category_id: Number(categoryId),
      };

      console.log("📡 Fetching subcategories with params:", params);

      try {
        const res = await AxiosAdmin.get<ApiListResponse<Subcategory>>("/subcategories/", {
          params,
        });

        console.log("📥 Subcategory API response:", res.data);

        const items = uniqueById(res.data?.results ?? []);
        console.log("✅ Setting subcategories:", items.map((i) => ({ id: i.id, name: i.name })));
        setSubcategories(items);
        setSubcategoryRequestId(currentRequestId);
      } catch (err) {
        console.error("❌ Subcategory fetch error:", err);
        setSubcategories([]);
      }
    };

    loadSubcategories();
  }, [groupId, subjectId, categoryId]);

  const onSubmit = async () => {
    setLoadingQuestions(true);
    try {
      const res = await AxiosAdmin.get<ApiListResponse<Question>>(
        "/dashboard/recent-questions/",
        {
          params: {
            created_at: 0,
            ...(level ? { level } : {}),
            ...(groupId ? { group_id: groupId } : {}),
            ...(subjectId ? { subject_id: subjectId } : {}),
            ...(categoryId ? { category_id: categoryId } : {}),
            ...(subcategoryId ? { subcategory_id: subcategoryId } : {}),
          },
        }
      );
      setQuestions(res.data?.results ?? []);
    } catch {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const onReset = () => {
    setGroupId("");
    setSubjectId("");
    setCategoryId("");
    setSubcategoryId("");
    setLevel("");
    setSubjects([]);
    setCategories([]);
    setSubcategories([]);
    setQuestions([]);
  };

  const rows = useMemo(() => {
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

    return questions.map((q) => ({
      id: q.id,
      group: q.group ?? "",
      subject: q.subject ?? "",
      category: q.category ?? "",
      level: q.level ?? "",
      type: q.type ?? "",
      created_at: q.created_at ? q.created_at.slice(0, 10) : "",
      question: q.metadata?.question ?? "",
      action: actionCell,
    }));
  }, [questions]);

  return (
    <div className="min-w-0">
      <AdminHeader
        title="Question Management"
        subtitle="Filter, manage, and create educational questions."
      />

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <AdminSelect
            placeholder="Group"
            value={groupId}
            onChange={setGroupId}
            options={uniqueOptionsByLabel(
              groups
                .map((g) => ({ value: String(g.id), label: getName(g) }))
                .filter((o) => o.label)
            )}
          />
          <AdminSelect
            placeholder="Subject"
            value={subjectId}
            onChange={setSubjectId}
            disabled={!groupId}
            options={uniqueOptionsByLabel(
              subjects
                .map((s) => ({ value: String(s.id), label: getName(s) }))
                .filter((o) => o.label)
            )}
          />
          <AdminSelect
            placeholder="Category"
            value={categoryId}
            onChange={setCategoryId}
            disabled={!groupId || !subjectId}
            options={uniqueOptionsByLabel(
              categories
                .map((c) => ({ value: String(c.id), label: getName(c) }))
                .filter((o) => o.label)
            )}
          />
          <AdminSelect
            placeholder="Sub-category"
            value={subcategoryId}
            onChange={setSubcategoryId}
            disabled={!groupId || !subjectId || !categoryId}
            options={uniqueOptionsByLabel(
              subcategories
                .map((sc) => ({ value: String(sc.id), label: getName(sc) }))
                .filter((o) => o.label)
            )}
          />
          <AdminSelect
            placeholder="Level"
            value={level}
            onChange={setLevel}
            options={[
              { value: "easy", label: "easy" },
              { value: "medium", label: "medium" },
              { value: "hard", label: "hard" },
            ]}
          />

          <button
            type="button"
            onClick={onSubmit}
            disabled={loadingQuestions}
            className="ml-2 h-9 rounded-lg bg-orange-600 px-5 text-xs font-semibold text-white hover:bg-orange-700"
          >
            {loadingQuestions ? "Loading..." : "Submit"}
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
            rows={rows.length ? rows : [{ id: "", group: "", subject: "", category: "", level: "", type: "", created_at: "", question: "", action: "" }]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminQeustions;
