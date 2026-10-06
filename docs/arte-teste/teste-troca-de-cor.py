import numpy as np, colorsys, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
def rgb2hsv(a):
    a=a/255.0; mx=a.max(-1); mn=a.min(-1); d=mx-mn
    h=np.zeros_like(mx); m=d>1e-6; r,g,b=a[...,0],a[...,1],a[...,2]
    i=m&(mx==r); h[i]=((g-b)[i]/d[i])%6
    i=m&(mx==g)&~(mx==r); h[i]=(b-r)[i]/d[i]+2
    i=m&(mx==b)&~(mx==r)&~(mx==g); h[i]=(r-g)[i]/d[i]+4
    return h/6, np.where(mx>0,d/np.maximum(mx,1e-6),0), mx
hexrgb=lambda x: np.array([int(x[i:i+2],16) for i in (1,3,5)],float)
def soft(mask,r=1.2): return np.asarray(Image.fromarray((mask*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(float)/255
def paint(res,mask,color_map,v,ref):
    # sombra da pintura preservada: luminância relativa multiplica a cor nova; cor escura ganha um piso para não chapar
    shade=np.clip(v/ref,0,1.25)[...,None]
    lum=color_map.mean(-1,keepdims=True)/255
    col=color_map*(0.35+0.65*shade)*(1-lum*0)+ (1-lum)*18*(shade-0.6)
    a=soft(mask)[...,None]
    return res*(1-a)+np.clip(col,0,255)*a
def render(src,out,c1,c2,pattern='lisa',number=None,numcolor='#FFFFFF',skin=None,hair=None):
    im=Image.open(src).convert('RGB'); a=np.asarray(im).astype(float); H,W=a.shape[:2]; h,s,v=rgb2hsv(a)
    yy,xx=np.mgrid[0:H,0:W]
    mag=(h>0.78)&(h<0.93)&(s>0.4)&(v>0.25)
    cy=(h>0.47)&(h<0.555)&(s>0.5)&(v>0.38)
    # camisa do protagonista: faixa central
    sel=mag&(xx>W*0.3)&(xx<W*0.7); ys,xs=np.where(sel); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
    cx=(x0+x1)/2; sw=x1-x0; sh=y1-y0
    A,B=hexrgb(c1),hexrgb(c2)
    cm=np.zeros_like(a); cm[...]=A
    if pattern=='listras':   cm[((xx-x0)//(sw/7)).astype(int)%2==1]=B
    if pattern=='faixas':    cm[((yy-y0)//(sh/6)).astype(int)%2==1]=B
    if pattern=='diagonal':  cm[np.abs((xx-cx)*0.9+(yy-(y0+sh*0.5)))<sh*0.11]=B
    res=paint(a,mag,cm,v,np.percentile(v[mag],85))
    cm2=np.zeros_like(a); cm2[...]=B if pattern!='lisa' else B
    res=paint(res,cy,cm2,v,np.percentile(v[cy],85))
    # região do protagonista
    box=(xx>x0-sw*0.25)&(xx<x1+sw*0.25)&(yy>y0-sh*0.6)&(yy<H*0.72)
    if skin:
        sk=box&(h>0.02)&(h<0.105)&(s>0.3)&(s<0.85)&(v>0.22)&(v<0.92)&~mag&~cy
        hh,ss,vv=rgb2hsv(res); kv,ks,dh=skin
        n=np.stack([np.clip(hh+dh,0,1),np.clip(ss*ks,0,1),np.clip(vv*kv,0,1)],-1)
        rgb=np.zeros_like(res)
        flat=n.reshape(-1,3); out_=np.array([colorsys.hsv_to_rgb(*p) for p in flat[sk.reshape(-1)]])*255
        rgb[sk]=out_; al=soft(sk,1.0)[...,None]; res=np.where(sk[...,None],res*(1-al)+rgb*al,res)
    if hair:
        hr=box&(yy<y0+sh*0.02)&(v<0.42)&(np.abs(xx-cx)<sw*0.28)&((h<0.14)|(h>0.95))&(s>0.18)
        T=hexrgb(hair); al=soft(hr,1.5)[...,None]; tone=(0.45+1.9*v)[...,None]
        res=res*(1-al)+np.clip(T*tone,0,255)*al
    img=Image.fromarray(np.clip(res,0,255).astype(np.uint8))
    if number:
        d=ImageDraw.Draw(img); f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Impact.ttf',int(sh*0.40))
        d.text((cx,y0+sh*0.46),number,font=f,fill=tuple(int(x) for x in hexrgb(numcolor)),anchor='mm',stroke_width=max(1,int(sh*0.006)),stroke_fill=(20,20,20))
    img.save(out,quality=90); return img
