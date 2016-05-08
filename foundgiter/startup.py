#!/usr/bin/env python
# *_* coding=utf-8 *_*

import eventlet
import pprint
import ujson
from eventlet.green import urllib, urllib2
from pyquery import PyQuery as pyq

pool = eventlet.GreenPool()


def get_project_path():
    '''
    获取项目所在路径
    '''
    paths = __file__.split("/")[0:-2]
    paths.append("html")
    return "/".join(paths)


class Crawler(object):

    _domain = "https://github.com"
    _url = "https://github.com/search"
    _too_many_request_sleep = 3

    def fetch(self, keyword):
        fd = pool.spawn(self._fetch_query, "%s?q=%s" %
                        (self._url, urllib.quote_plus(keyword)))
        data = fd.wait()
        self._save(data)

    def _save(self, data):
        file_path = get_project_path() + "/data.json"
        with open(file_path, 'wb+') as file:
            file.write(ujson.dumps(data))

    def _fetch_query(self, url, page=0):
        print "-" * 10, " Fetch Page %s " % (page + 1), "-" * 10
        print url

        try:
            html = urllib2.urlopen(url).read()
        except urllib2.HTTPError as e:
            if e.code == 429:
                print "#" * 10, " 429 Too many request.Sleep %s seconds. " % self._too_many_request_sleep, "#" * 10
                eventlet.sleep(self._too_many_request_sleep)
                return self._fetch_query(url, page)
            raise e
        jq = pyq(html)

        urls = []

        user_list = jq(".user-list-item")
        for i in user_list:
            name = pyq(i).find(".user-list-info a")
            href = self._domain + name.attr("href")

            urls.append(href)

        users = []
        for user in pool.imap(self._fetch_user, urls):
            users.append(user)

        if page == 0:
            max_page_index = jq(".next_page").prev("a").text()
            users.extend(self._fetch_query_by_page(url, int(max_page_index)))

        return users

    def _fetch_query_by_page(self, url, max_page_index):

        data = []
        for x in xrange(2, max_page_index + 1):

            fd = pool.spawn(self._fetch_query, url + "&p=%s" % x, x)
            data.extend(fd.wait())

        return data

    def _fetch_user(self, url):
        try:
            html = urllib2.urlopen(url + "?tab=repositories").read()
        except urllib2.HTTPError as e:
            if e.code == 429:
                print "#" * 10, " 429 Too many request.Sleep %s seconds. " % self._too_many_request_sleep, "#" * 10
                eventlet.sleep(self._too_many_request_sleep)
                return self._fetch_user(url)
            raise e
        jq = pyq(html)

        data = {}
        data['url'] = url
        data['name'] = jq(".vcard-fullname").text()
        data['avatar'] = jq(".avatar").attr("src")
        data['location'] = jq("[aria-label='Home location']").attr("title")
        data['email'] = jq("[aria-label=Email] a").text()
        data['website'] = jq("[aria-label='Blog or website'] a").text()
        data['join'] = jq(".join-date").attr("datetime")
        data['followers'] = jq(".vcard-stat-count:eq(0)").text()
        data['starred'] = jq(".vcard-stat-count:eq(1)").text()
        data['following'] = jq(".vcard-stat-count:eq(2)").text()

        data['repositories'] = {}
        sources = jq(".repo-list-item.source")
        data['repositories']['source_count'] = len(sources)
        data['repositories']["source_lang"] = {}
        for i in sources:
            lang = pyq(i).find("[itemprop='programmingLanguage']").text()
            data['repositories']["source_lang"].setdefault(lang, 0)
            data['repositories']["source_lang"][lang] += 1

        return data
