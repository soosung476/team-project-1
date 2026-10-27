import type { ReactNode } from "react";

// 모든 화면 맨 위의 제목 영역 (위치 표시 + 제목 + 설명 + 오른쪽 버튼)
// - breadcrumb: 지금 위치. ["전자결재", "결재 대기함"] → "홈 / 전자결재 / 결재 대기함"
// - children: 오른쪽에 놓을 버튼들 (AuthProvider의 children과 같은 방식)
type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumb?: string[];
  children?: ReactNode;
};

const PageHeader = ({ title, description, breadcrumb = [], children }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      {breadcrumb.length > 0 && (
        <p className="mb-2 text-xs text-slate-400">
          홈
          {breadcrumb.map((item, index) => (
            <span key={item}>
              <span className="mx-1.5">/</span>
              {/* 마지막 칸(지금 화면)만 진하게 */}
              <span className={index === breadcrumb.length - 1 ? "text-slate-600" : ""}>
                {item}
              </span>
            </span>
          ))}
        </p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
