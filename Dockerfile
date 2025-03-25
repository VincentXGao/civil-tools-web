FROM node:20

ENV PROJECT_ENV production
ENV NODE_ENV production

WORKDIR /civil_tools_web
ADD . /civil_tools_web

RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g serve tyarn
RUN tyarn cache clean
RUN tyarn --production=false
RUN tyarn build

CMD serve -l 3000 -s dist