import numpy as np
import pandas as pd
import json
import requests
from flask import Flask, render_template, request
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def create_similarity():
    data = pd.read_csv('datasets/final_data.csv')
    # count matrix
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(data['comb'])
    # similarity score matrix
    similarity = cosine_similarity(count_matrix)
    return data,similarity



def rcmd(m):
    print(m)
    m = m.lower()
    data, similarity = create_similarity()
    try:
        data.head()
        similarity.shape
    except:
        data, similarity = create_similarity()
    if m not in data['movie_title'].unique():
        return('Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies')
    else:
        i = data.loc[data['movie_title']==m].index[0]
        lst = list(enumerate(similarity[i]))
        lst = sorted(lst, key = lambda x:x[1] ,reverse=True)
        lst = lst[1:11] # excluding first item since it is the requested movie itself
        l = []
        #print(lst)
        #print(lst[0][0])
        for i in range(len(lst)):
            a = lst[i][0]
            l.append(data['movie_title'][a] )
        print(l)
        #newlist = convert_to_list(l)
        #print(newlist)
        return l

        

 






app=Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
@app.route("/home")
def home():
    try:
        return render_template('index.html')
        #return "test string"
    except Exception as e:
        return str(e)

@app.route("/recommend",methods=["POST"])
def recommend():
    # getting data from AJAX request
    try:
        title = request.form['title']
        ans=[]
        ans=rcmd(title)
        print(ans)
        if type(ans)==type('string'):
           return ans
        else:
           m_str="---".join(ans)
           return m_str
        #return(ans)
        #return ",".join(ans)
        #return "Exorcism of God"
    except Exception as e:
        return ""


if __name__=='__main__':
    app.debug = True
    app.run()
    #app.run(debug=True, port=5001)


