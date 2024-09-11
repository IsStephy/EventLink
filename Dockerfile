FROM python
WORKDIR /app
ADD . /app 
CMD [ "python3", "app.py"]