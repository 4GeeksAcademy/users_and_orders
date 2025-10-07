from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, default=func.now(), nullable=False)

    orders = relationship("Order", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
            "order_count": len(self.orders)
        }


class Order(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(
        String(20), default="pending", nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime, default=func.now(), nullable=False)

    user = relationship("User", back_populates="orders")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_name": self.product_name,
            "amount": self.amount,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "user_name": self.user.name if self.user else None
        }
