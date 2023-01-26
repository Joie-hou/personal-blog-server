#需要从哪个镜像进行构建
FROM node:16

#创建一个文件夹存放应用程序代码
WORKDIR /personal-blog-server

#拷贝需要的文件 <本地路径><目标路径>
COPY . .

#创建镜像时运行的命令
RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

EXPOSE 3007

#docker容器运行起来后执行的命令
CMD [ "npm", "run", "start:pro" ]