n=6; row="";
for(( i=0; i<n; i++ )); do row="$row "; done; row="${row%?}*"; for(( i=0; i<n; i++ )); do echo "$row"; row="${row#?}**"; done