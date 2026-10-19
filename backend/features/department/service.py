from sqlalchemy import select
from sqlalchemy.orm import Session
from features.department.models import Department
from features.department.schema import DepartmentCreate, DepartmentResponse, DepartmentUpdate
from features.department.exceptions import DepartmentExistingException, DepartmentNotFoundException


def get_departments(db: Session):

    query = select(Department).order_by(Department.id)
    return db.scalars(query).all()


def create_department(db: Session, data: DepartmentCreate):

    query = select(Department).where(Department.name == data.name)

    existing = db.scalar(query)

    if existing is not None:
        raise DepartmentExistingException
    
    department = Department(name=data.name)

    db.add(department)
    db.commit()
    db.refresh(department)

    return department

def update_Department(db: Session, department_id: int, data: DepartmentUpdate):

    department = db.get(Department, department_id)

    # 만약 잘못된 부서를 선택했을 때,
    if department is None:
        raise DepartmentNotFoundException

    query = select(Department).where(Department.name == data.name, Department.id != department_id)

    existing = db.scalar(query)

    # 중복된 부서가 있다면,
    if existing is not None:
        raise DepartmentExistingException

    department.name = data.name
    db.commit()
    db.refresh(department)
    return department