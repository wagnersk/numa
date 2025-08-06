import {  View } from "react-native"

import { TartgetGridProps } from ".."
import { colors } from "@/theme"

type Props = {
    data:TartgetGridProps[]
    focusedId:string | null
    
}

export function Bullets({data,focusedId}:Props){
    return ( 
        <View   
            style={{ 
                flex:1,
                flexDirection:'row',
                gap:4,
                justifyContent:'center'
            }}
            >
                    {data?.map((item,index)=>{  
                        return (<View
                        key={index}
                        style={
                           [{ height:8, borderRadius: 24 },
                            focusedId===item.id
                            ?
                            {
                             width:24,
                             backgroundColor:colors.black,
                            }
                            : 
                            {
                            width:8,
                            backgroundColor:colors.gray[700],
                             }]
                        }
                         />)
                    })}
 
           
      
        </View>
    )
}