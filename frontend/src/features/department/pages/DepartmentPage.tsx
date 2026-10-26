import { useState,useEffect } from "react";
import type { DepartmentResponse } from "../types/department";
import {
     getDepartments,
     CreateDepartment,DeleteDepartment,
     UpdateDepartment 
    } from "../apis/departmentApi";
import { useNavigate } from "react-router-dom";



export default function DepartmentPage() {

    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const navigate = useNavigate();

    const fetchDepartments = async () => {
        const data = await getDepartments();
        setDepartments(data);
    };

    useEffect(()=> {
        fetchDepartments();
    }, []);
    
    const handleCreate = async () => {
        const createdDept = await CreateDepartment({ name: newName});
        setDepartments([...departments, createdDept]);
        setNewName("");
    };

    const handleDelete = async (id : number) => {
        try {
            await DeleteDepartment(id);
            setDepartments(departments.filter((department)=> department.id !== id));            
        }catch (error) {
            alert("소속된 사원이 있는 부서는 삭제 할 수 없습니다.")
        }
    };
    
    const handleUpdate = async (id: number)=>{
        if (!editName) return;
        await UpdateDepartment(
            id, {
                name: editName
            });
        setEditingId(null);
        fetchDepartments();
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6 py-4">
            {/* 상단 타이틀 헤더 영역 */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            부서 관리
                        </h1>
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            사용자관리
                        </button>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                        사내 부서 목록을 조회하고 새로운 부서를 등록·수정·삭제할 수 있습니다.
                    </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
                    총 {departments.length}개 부서
                </span>
            </div>

            {/* 새 부서 추가 입력 카드 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    새 부서 등록
                </label>
                <div className="flex gap-3">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="새 부서 이름을 입력하세요 (예: 개발팀, 인사팀)"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                        onClick={handleCreate}
                        className="cursor-pointer rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
                    >
                        + 부서 추가
                    </button>
                </div>
            </div>

            {/* 부서 목록 카드 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-3.5 text-xs font-semibold text-slate-500">
                    등록된 부서 목록
                </div>

                {departments.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-400">
                        아직 등록된 부서가 없습니다. 위 입력창에서 첫 부서를 추가해 보세요!
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {departments.map((department) => (
                            <li
                                key={department.id}
                                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50/80"
                            >
                                <div className="flex items-center gap-3.5">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                        {department.id}
                                    </span>
                                    <div>
                                        <span className="text-base font-medium text-slate-800">
                                            {department.name}
                                        </span>

                                        {editingId === department.id && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    placeholder="새 부서 이름 입력"
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                                <button
                                                    onClick={() => handleUpdate(department.id)}
                                                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(department.id);
                                            setEditName(department.name);
                                        }}
                                        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(department.id)}
                                        className="cursor-pointer rounded-lg border border-transparent bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
