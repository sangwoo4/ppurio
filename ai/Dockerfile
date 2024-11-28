# Dockerfile

# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /Utils

# Install dependencies
COPY requirements.txt /Utils/
RUN pip install --no-cache-dir -r /Utils/requirements.txt

# Copy the entire application code
COPY . /Utils

# Expose the port FastAPI is running on
EXPOSE 8000

# Set the PYTHONPATH to include the ai directory
ENV PYTHONPATH=/Utils/ai

# Run the FastAPI application with --reload
CMD ["uvicorn", "Utils.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]