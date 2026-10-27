import { useState,useEffect } from "react";
import type { DepartmentResponse } from "../types/department";
import {
     getDepartments,
     CreateDepartment,DeleteDepartment,
     UpdateDepartment
    } from "../apis/departmentApi";
import PageHeader from "../../../common/components/PageHeader";
import {
    badge,
    btnDangerSm,
    btnPrimary,
    btnPrimarySm,
    btnSecondarySm,
    card,
    cardHeader,
    cardTitle,
    emptyText,
    input,
    inputSm,
    label,
} from "../../../common/style";



export default function DepartmentPage() {

    const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

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
        <div>
            {/* 사용자 관리로 가는 버튼은 왼쪽 사이드바 「관리자」 메뉴로 옮김 */}
            <PageHeader
                title="부서 관리"
                description="사내 부서 목록을 조회하고 새로운 부서를 등록·수정·삭제할 수 있습니다."
                breadcrumb={["관리자", "부서 관리"]}
            >
                <span className={`${badge} bg-indigo-50 text-indigo-700`}>
                    총 {departments.length}개 부서
                </span>
            </PageHeader>

            {/* 새 부서 추가 입력 카드 */}
            <div className={`mb-4 p-5 ${card}`}>
                <label className={label}>새 부서 등록</label>
                <div className="flex gap-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="새 부서 이름을 입력하세요 (예: 개발팀, 인사팀)"
                        className={`${input} flex-1`}
                    />
                    <button onClick={handleCreate} className={btnPrimary}>
                        + 부서 추가
                    </button>
                </div>
            </div>

            {/* 부서 목록 카드 */}
            <div className={`overflow-hidden ${card}`}>
                <div className={cardHeader}>
                    <h2 className={cardTitle}>등록된 부서 목록</h2>
                </div>

                {departments.length === 0 ? (
                    <p className={emptyText}>
                        아직 등록된 부서가 없습니다. 위 입력창에서 첫 부서를 추가해 보세요.
                    </p>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {departments.map((department) => (
                            <li
                                key={department.id}
                                className="flex items-center justify-between px-5 py-3.5 transition hover:bg-slate-50"
                            >
                                <div className="flex min-h-8 items-center gap-3.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                        {department.id}
                                    </span>

                                    {/* 수정 중인 줄: 이름 자리에 입력창 + 저장·취소 */}
                                    {editingId === department.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                placeholder="새 부서 이름 입력"
                                                className={inputSm}
                                            />
                                            <button
                                                onClick={() => handleUpdate(department.id)}
                                                className={btnPrimarySm}
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className={btnSecondarySm}
                                            >
                                                취소
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-800">
                                            {department.name}
                                        </span>
                                    )}
                                </div>

                                {/* 수정 중인 줄에서는 수정·삭제 버튼을 숨김 (저장·취소만 보이게) */}
                                {editingId !== department.id && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingId(department.id);
                                                setEditName(department.name);
                                            }}
                                            className={btnSecondarySm}
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(department.id)}
                                            className={btnDangerSm}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
