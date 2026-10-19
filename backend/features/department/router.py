from fastapi import APIRouter,Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from features.department.schema import DepartmentResponse,DepartmentCreate,DepartmentUpdate
from features.department import service
from features.department.exceptions import DepartmentExistingException,DepartmentNotFoundException

router = APIRouter(prefix="/department", tags=["departments"])


@router.get("", response_model=list[DepartmentResponse])
def get_departments(db:Session = Depends(get_db)):
    return service.get_departments(db)

@router.post("", response_model=DepartmentResponse)
def create_department(data: DepartmentCreate, db: Session = Depends(get_db)):
    try:
        return service.create_department(db, data)
    except DepartmentExistingException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 부서 이름입니다."
        )
    

@router.put("/{department_id}", response_model=DepartmentResponse)
def update_department(department_id: int, data: DepartmentUpdate, db: Session = Depends(get_db)):
    try:
        return service.update_Department(db, department_id, data)
    except DepartmentNotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 부서를 찾을 수 없습니다."
        )
    except DepartmentExistingException:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 존재하는 부서 이름입니다."
        )
# @router.delete("/{department_id}")
# def delete_Department(department_id: int, db: Session = Depends(get_db)):
#     service.delete_Department(db, department_id)