import { router } from "expo-router";
import { useEffect } from "react";
import Login from "./auth/login";

export default function Index(){

    useEffect(()=>{
        const isLoggedIn = true

        if(isLoggedIn){
            router.navigate('/tabs')
        } else {
              <Login/>
        }

    },[])

    return (
        <Login/>
    )
}
  
      
    /*     <Suspense fallback={<Loading />}>
            <SQLiteProvider
                databaseName="target.db"
                onInit={migrate}
                useSuspense
                >
                <Stack
                screenOptions={{
                    headerShown:false,
                    contentStyle:{ backgroundColor: colors.white }
                }}
                />
            </SQLiteProvider>
        </Suspense> */